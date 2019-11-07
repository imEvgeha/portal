import {put, call, takeEvery} from '@redux-saga/core/effects';
import * as actionTypes from './rightHistoryActionTypes';
import {getRightsHistory} from './rightHistoryService';
import mockData from '../../containers/contracts/audit/mockDataHistoryView';

function* fetchRightsHistory(requestMethod, {payload}) {
    try {
        yield put({
            type: actionTypes.FETCH_RIGHT_HISTORY_REQUEST,
            payload: {}
        });

        //TODO Update after api will be ready
        let rightsEventHistory = payload.map(() => mockData);
        if (!mockData) {
            const response = call(requestMethod, payload);
            rightsEventHistory = response.data;
        }

        yield put({
            type: actionTypes.FETCH_RIGHT_HISTORY_SUCCESS,
            payload: {rightsEventHistory}
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