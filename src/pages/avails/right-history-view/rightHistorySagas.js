import {put, call, takeEvery} from 'redux-saga/effects';
import * as actionTypes from './rightHistoryActionTypes';
import {getRightsHistory} from './rightHistoryService';

function* fetchRightsHistory(requestMethod, {payload}) {
    try {
        yield put({
            type: actionTypes.FETCH_RIGHT_HISTORY_REQUEST,
            payload: {},
        });

        const response = yield call(requestMethod, payload);

        yield put({
            type: actionTypes.FETCH_RIGHT_HISTORY_SUCCESS,
            payload: {
                rightsEventHistory: response,
                rightIds: payload,
            },
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_RIGHT_HISTORY_ERROR,
            payload: error,
            error: true,
        });
    }
}

export default function* rightHistoryWatcher() {
    yield takeEvery(actionTypes.FETCH_AND_STORE_RIGHT_HISTORY, fetchRightsHistory, getRightsHistory);
}
