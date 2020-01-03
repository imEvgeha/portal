import {call, put, all, takeLatest} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import actionTypes from './availsActionTypes';
import {URL} from '../util/Common';
import {historyService} from '../containers/avail/service/HistoryService';
import Constants from './Constants';
import {getFiltersToSend} from './ingest-panel/utils';
import FilterConstants from './ingest-panel/Constants';

const {PAGE_SIZE, sortParams} = Constants;
const {URLFilterKeys} = FilterConstants;

function* fetchIngests({payload}) {
    try {
        const filters = {};
        Object.keys(URLFilterKeys).map(key => filters[URLFilterKeys[key]] = payload[key]);
        filters.page = '';
        const url = `${window.location.pathname}?${URL.updateQueryParam(filters)}`;
        yield put(push(URL.keepEmbedded(url)));
        const response = yield call(historyService.advancedSearch, payload, 0, PAGE_SIZE, sortParams);
        yield put({
            type: actionTypes.FETCH_INGESTS_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_INGESTS_ERROR,
        });
    }
}

function* fetchNextPage() {
    try {
        const filters = getFiltersToSend();
        const page = parseInt(URL.getParamIfExists('page') || 0) + 1;
        const url = `${window.location.pathname}?${URL.updateQueryParam({page})}`;
        yield put(push(URL.keepEmbedded(url)));
        const response = yield call(historyService.advancedSearch, filters, page, PAGE_SIZE, sortParams);
        yield put({
            type: actionTypes.FETCH_NEXT_PAGE_SUCCESS,
            payload: response.data.data,
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_NEXT_PAGE_ERROR,
        });
    }
}

export default function* availsWatcher() {
    yield all([
        takeLatest(actionTypes.FETCH_INGESTS, fetchIngests),
        takeLatest(actionTypes.FETCH_NEXT_PAGE, fetchNextPage),
    ]);
}