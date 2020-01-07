import {call, put, all, takeLatest, select} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import actionTypes from './availsActionTypes';
import {URL} from '../util/Common';
import {historyService} from '../containers/avail/service/HistoryService';
import Constants from './Constants';
import {getFiltersToSend} from './ingest-panel/utils';
import FilterConstants from './ingest-panel/Constants';
import {getIngestById} from './availsSelectors';

const {PAGE_SIZE, sortParams, AVAIL_HISTORY_ID} = Constants;
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

function* filterRightsByStatus({payload}) {
    const url = `${window.location.pathname}?${URL.updateQueryParam({status: payload})}`;
    yield put(push(URL.keepEmbedded(url)));
}

function* selectIngest({payload}) {
    let ingestId = payload;
    if(ingestId) {
        const url = `${window.location.pathname}?${URL.updateQueryParam({[AVAIL_HISTORY_ID]: payload})}`;
        yield put(push(URL.keepEmbedded(url)));
    } else {
        const params = new URLSearchParams(window.location.search.substring(1));
        ingestId = params.get(Constants.AVAIL_HISTORY_ID);
    }
    let selectedIngest = yield select(getIngestById, ingestId);
    if(!selectedIngest){
        const response = yield call(historyService.getHistory, ingestId);
        selectedIngest = response.data;
    }
    yield put({
        type: actionTypes.UPDATE_SELECTED_INGEST,
        payload: selectedIngest,
    });
}

export default function* availsWatcher() {
    yield all([
        takeLatest(actionTypes.FETCH_INGESTS, fetchIngests),
        takeLatest(actionTypes.FETCH_NEXT_PAGE, fetchNextPage),
        takeLatest(actionTypes.FILTER_RIGHTS_BY_STATUS, filterRightsByStatus),
        takeLatest(actionTypes.SELECT_INGEST, selectIngest),
    ]);
}