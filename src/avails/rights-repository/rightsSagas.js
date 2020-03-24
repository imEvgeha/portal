import {call, put, all, takeEvery, select} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import * as actionTypes from './rightsActionTypes';

export function* storeRightsFilter({payload}) {
    try {
        yield put({
            type: actionTypes.ADD_RIGHTS_FILTER_SUCCESS,
            payload,
        });
    } catch (error) {
        yield put({
            type: actionTypes.ADD_RIGHTS_FILTER_ERROR,
            payload: error,
        });
    }
}

export function* rightsWatcher() {
    yield all([
        takeEvery(actionTypes.ADD_RIGHTS_FILTER, storeRightsFilter),
    ]);
}
