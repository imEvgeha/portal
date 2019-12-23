import {call, put, all, takeLatest} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import actionTypes from './availsActionTypes';
import {URL} from '../util/Common';
import {historyService} from '../containers/avail/service/HistoryService';
import Constants from './Constants';

const {PAGE_SIZE, sortParams} = Constants;

function* updateFilters({payload}) {
    try {
        const query = Object.keys(payload).map(key => key + '=' + payload[key]).join('&');
        const url = `${window.location.pathname}?${query}`;
        yield put(push(URL.keepEmbedded(url)));
        yield put({
            type: actionTypes.FETCH_AVAILS,
        });
        const response = yield call(historyService.advancedSearch, payload, 0, PAGE_SIZE, sortParams);
        yield put({
            type: actionTypes.FETCH_AVAILS_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_AVAILS_ERROR,
        });
    }
}

export default function* availsWatcher() {
    yield all([
        takeLatest(actionTypes.UPDATE_FILTERS, updateFilters),
    ]);
}