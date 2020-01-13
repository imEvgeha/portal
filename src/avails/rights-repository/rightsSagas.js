import {call, put, all, takeLatest, select} from 'redux-saga/effects';
import actionTypes from './rightsActionTypes';

function* storeRights({payload}) {
    try {
        yield put({
            type: actionTypes.STORE_RIGHTS,
            payload: response.data,
        });
    } catch (error) {
        yield put({
            type: actionTypes.STORE_RIGHTS_ERROR,
        });
    }
}

