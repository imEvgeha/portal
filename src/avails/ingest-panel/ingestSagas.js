import {call, put, all, takeLatest, select} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import actionTypes from './ingestActionTypes';
import {URL} from '../../util/Common';
import {historyService} from '../../containers/avail/service/HistoryService';
import Constants from '../constants';
import {getFiltersToSend} from './utils';
import FilterConstants from './constants';
import {getIngestById} from './ingestSelectors';
import {ADD_RIGHTS_FILTER, REMOVE_RIGHTS_FILTER} from '../rights-repository/rightsActionTypes';
import {uploadService} from '../../containers/avail/service/UploadService';
import {ADD_TOAST} from '../../ui-elements/nexus-toast-notification/actionTypes';
import { SUCCESS_ICON, SUCCESS_TITLE } from '../../ui-elements/nexus-toast-notification/constants';

const {PAGE_SIZE, sortParams, AVAIL_HISTORY_ID, INGEST_HISTORY_ATTACHMENT_IDS} = Constants;
const {URLFilterKeys} = FilterConstants;
const UPLOAD_SUCCESS_MESSAGE = 'You have successfully uploaded an Avail.';

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
    const queryParam = payload ? {status: payload} : {};

    if (payload) {
        yield put({
            type: ADD_RIGHTS_FILTER,
            payload: {external: queryParam},
        });
        return;
    }

    yield put({
        type: REMOVE_RIGHTS_FILTER,
        payload: {
            filter: 'status',
        }
    });
}

function* selectIngest({payload}) {
    const {availHistoryId, attachmentId} = payload || {};
    let ingestId = availHistoryId; 
    const queryParam = {[AVAIL_HISTORY_ID]: ingestId, [INGEST_HISTORY_ATTACHMENT_IDS]: attachmentId};

    if (ingestId) {
        const url = `${window.location.pathname}?${URL.updateQueryParam(queryParam)}`;
        yield put(push(URL.keepEmbedded(url)));
        yield put({
            type: ADD_RIGHTS_FILTER,
            payload: {external: queryParam},
        });

        if (!attachmentId) {
            yield put({
                type: REMOVE_RIGHTS_FILTER,
                payload: {
                    filter: INGEST_HISTORY_ATTACHMENT_IDS,
                }
            });
        }
    } else {
        const params = new URLSearchParams(window.location.search.substring(1));
        ingestId = params.get(Constants.AVAIL_HISTORY_ID);
    }
    if (ingestId) {
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
}

function* uploadIngest({payload}) {
    const {file, closeModal, ...rest} = payload || {};
    try {
        yield put({
            type: actionTypes.IS_UPLOADING,
            payload: true,
        });
        const response = yield uploadService.uploadAvail(file, null, null, {...rest});
        if(response.status === 200) {
            closeModal();
            yield put({
                type: ADD_TOAST,
                payload: {
                    title: SUCCESS_TITLE,
                    icon: SUCCESS_ICON,
                    isAutoDismiss: true,
                    description: `${UPLOAD_SUCCESS_MESSAGE} ${response.data.fileName}`,
                }
            });
        }
        yield put({
            type: actionTypes.IS_UPLOADING,
            payload: false,
        });
    }
    catch (e) {
        yield put({
            type: actionTypes.IS_UPLOADING,
            payload: false,
        });
    }
}

export default function* ingestWatcher() {
    yield all([
        takeLatest(actionTypes.FETCH_INGESTS, fetchIngests),
        takeLatest(actionTypes.FETCH_NEXT_PAGE, fetchNextPage),
        takeLatest(actionTypes.FILTER_RIGHTS_BY_STATUS, filterRightsByStatus),
        takeLatest(actionTypes.SELECT_INGEST, selectIngest),
        takeLatest(actionTypes.UPLOAD_INGEST, uploadIngest),
    ]);
}
