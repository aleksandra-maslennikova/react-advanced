import firebase from 'firebase';
import { Record, List, OrderedMap } from 'immutable';
import { reset } from 'redux-form';
import { put, call, takeEvery, all } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import { appName } from '../config';
import { generateId, fbDatatoEntities } from './utils';


// Constants
const ReducerState = Record({
    entities: new OrderedMap([]),
    loading: false,
    loaded: false
});

const PersonRecord = Record({
    uid: null,
    firstName: null,
    lastName: null,
    email: null
});

export const moduleName = 'people';
const prefix = `${appName}/${moduleName}`;
export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`;
export const ADD_PERSON_SUCCESS = `${prefix}/ADD_PERSON_SUCCESS`;
export const ADD_PERSON_ERROR = `${prefix}/ADD_PERSON_ERROR`;
export const FETCH_ALL_PEOPLE_REQUEST = `${prefix}/FETCH_ALL_PEOPLE_REQUEST`;
export const FETCH_ALL_PEOPLE_SUCCESS = `${prefix}/FETCH_ALL_PEOPLE_SUCCESS`;
export const FETCH_ALL_PEOPLE_ERROR = `${prefix}/FETCH_ALL_PEOPLE_ERROR`;

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
        default:
            return state
    }
}

//  Selectors 

export const stateSelector = state => state[moduleName];
export const entitiesSelector = createSelector(stateSelector, state => state.entities);
export const peopleListSelector = createSelector(entitiesSelector, entities => entities.valueSeq().toArray());

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

export const saga = function* () {
    yield all([
        takeEvery(ADD_PERSON_REQUEST, addPersonSaga),
        takeEvery(FETCH_ALL_PEOPLE_REQUEST, fetchAllPeopleSaga)
    ])
};