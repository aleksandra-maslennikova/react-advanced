import firebase from 'firebase';
import { Record, List, OrderedMap } from 'immutable';
import { reset } from 'redux-form';
import { put, call, takeEvery, all, select, spawn, fork, cancel, cancelled, race, take } from 'redux-saga/effects';
import { delay, eventChannel } from 'redux-saga';
import { createSelector } from 'reselect';

import { appName } from '../config';
import { generateId, fbDatatoEntities } from './utils';


// Constants
const ReducerState = Record({
    entities: new OrderedMap([]),
    loading: false
});

const PersonRecord = Record({
    uid: null,
    firstName: null,
    lastName: null,
    email: null,
    events: []
});

export const moduleName = 'people';
const prefix = `${appName}/${moduleName}`;
export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`;
export const ADD_PERSON_SUCCESS = `${prefix}/ADD_PERSON_SUCCESS`;
export const ADD_PERSON_ERROR = `${prefix}/ADD_PERSON_ERROR`;
export const FETCH_ALL_PEOPLE_REQUEST = `${prefix}/FETCH_ALL_PEOPLE_REQUEST`;
export const FETCH_ALL_PEOPLE_SUCCESS = `${prefix}/FETCH_ALL_PEOPLE_SUCCESS`;
export const FETCH_ALL_PEOPLE_ERROR = `${prefix}/FETCH_ALL_PEOPLE_ERROR`;
export const ADD_EVENT_REQUEST = `${prefix}/ADD_EVENT_REQUEST`;
export const ADD_EVENT_SUCCESS = `${prefix}/ADD_EVENT_SUCCESS`;
export const ADD_EVENT_ERROR = `${prefix}/ADD_EVENT_ERROR`;

// Reducer
export default function reducer(state = new ReducerState(), action) {
    const { type, payload } = action;

    switch (type) {
        case ADD_PERSON_REQUEST:
            return state.set('loading', true)
        case ADD_PERSON_SUCCESS:
            return state
                .set('loading', false)
                .setIn(['entities', payload.uid], new PersonRecord(payload))
        case FETCH_ALL_PEOPLE_REQUEST:
            return state.set('loading', true)
        case FETCH_ALL_PEOPLE_SUCCESS:
            return state
                .set('loading', false)
                .set('entities', fbDatatoEntities(payload, PersonRecord))
        case ADD_EVENT_SUCCESS:
            return state.setIn(['entities', payload.personUid, 'events'], payload.events)
        default:
            return state
    }
}

//  Selectors 

export const stateSelector = state => state[moduleName];
export const entitiesSelector = createSelector(stateSelector, state => state.entities);
export const peopleListSelector = createSelector(entitiesSelector, entities => entities.valueSeq().toArray());
const idSelector = (_, props) => props.uid;
export const personSelector = createSelector(entitiesSelector, idSelector, (entities, id) => entities.get(id));

// Action creators
export function addPerson(person) {
    return {
        type: ADD_PERSON_REQUEST,
        payload: person
    }
};

export function fetchAllPeople() {
    return {
        type: FETCH_ALL_PEOPLE_REQUEST
    }
};

export function addEventToPerson(eventUid, personUid) {
    return {
        type: ADD_EVENT_REQUEST,
        payload: { eventUid, personUid }
    }
}

// Sagas

export const addPersonSaga = function* (action) {
    const ref = firebase.database().ref('people');
    try {
        const data = yield call([ref, ref.push], action.payload);
        yield put({
            type: ADD_PERSON_SUCCESS,
            payload: { ...action.payload, uid: data.key }
        });
        yield put(reset('person'));
    } catch (error) {
        yield put({
            type: ADD_PERSON_ERROR,
            error
        });
    }
};


export function* fetchAllPeopleSaga(action) {
    const ref = firebase.database().ref('people');
    try {
        const data = yield call([ref, ref.once], 'value');
        yield put({
            type: FETCH_ALL_PEOPLE_SUCCESS,
            payload: data.val()
        })
    } catch (error) {
        yield put({
            type: FETCH_ALL_PEOPLE_ERROR,
            error
        })
    }
};

export function* addEventToPersonSaga(action) {
    const { eventUid, personUid } = action.payload;
    const eventsRef = firebase.database().ref(`people/${personUid}/events`);
    const state = yield select(stateSelector);
    const events = state.getIn(['entities', personUid, 'events']).concat(eventUid);
    try {
        yield call([eventsRef, eventsRef.set], events);
        yield put({
            type: ADD_EVENT_SUCCESS,
            payload: {
                personUid,
                events
            }
        })
    } catch (error) {
        yield put({
            type: ADD_EVENT_ERROR,
            error
        })
    }
}

export const backgroundSyncSaga = function* () {
    try {
        while (true) {
            yield call(fetchAllPeopleSaga)
            yield delay(6000)
        }
    } finally {
        if (yield cancelled()) {
            console.log('cancelled saga')
        }
    }
}

export const cancellableSyncSaga = function* () {

    yield race({
        sync: realtimeSync(),
        delay: delay(6000)
    })


    // two ways to cancel saga
    /*yield race({
        sync: backgroundSyncSaga(),
        delay: delay(6000)
    })*/

    /* 
   const task = yield fork(backgroundSyncSaga)  
    yield delay(6000)
    yield cancel(task)*/
}

export const createPeopleSocket = () => eventChannel(emmit => {
    const ref = firebase.database().ref('people');
    const callback = data => emmit({ data });
    ref.on('value', callback);
    return () => ref.off('value', callback);
});

export const realtimeSync = function* () {
    const channel = yield call(createPeopleSocket);
    try {
        while (true) {
            const { data } = yield take(channel);
            yield put({
                type: FETCH_ALL_PEOPLE_SUCCESS,
                payload: data.val()
            })
        }
    } finally {
        yield call([channel, channel.close]); // unsubscribe from eventChannel
    }
}

export const saga = function* () {
    yield spawn(cancellableSyncSaga)
    // yield spawn(realtimeSync)
    yield all([
        takeEvery(ADD_PERSON_REQUEST, addPersonSaga),
        takeEvery(FETCH_ALL_PEOPLE_REQUEST, fetchAllPeopleSaga),
        takeEvery(ADD_EVENT_REQUEST, addEventToPersonSaga)
    ])
};
