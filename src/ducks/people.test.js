import firebase from 'firebase';
import { call, put } from 'redux-saga/effects';
import { addPersonSaga, ADD_PERSON_SUCCESS, ADD_PERSON_REQUEST } from './people';

import { generateId } from './utils';


it('should dispatch person with id', () => {
    const person = {
        firstName: 'Roman',
        email: 'test@test.com'
    }

    const saga = addPersonSaga({
        type: ADD_PERSON_REQUEST,
        payload: person
    })

    const ref = firebase.database().ref('people');

    expect(saga.next().value).toEqual(call([ref, ref.push]), person);

    const uid = generateId()

    expect(saga.next(id).value).toEqual(put({
        type: ADD_PERSON_SUCCESS,
        payload: { uid, ...person }
    }))
})