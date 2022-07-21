import {ADD_TOAST} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActionTypes';
import {SUCCESS_ICON} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import {URL, normalizeDataForStore} from '@vubiquity-nexus/portal-utils/lib/Common';
import {push} from 'redux-first-history';
import {call, put, all, takeLatest, select, delay} from 'redux-saga/effects';
import {historyService} from '../../legacy/containers/avail/service/HistoryService';
import {uploadService} from '../../legacy/containers/avail/service/UploadService';
import {ADD_RIGHTS_FILTER, REMOVE_RIGHTS_FILTER, SET_RIGHTS_FILTER} from '../rights-repository/rightsActionTypes';
import * as actionTypes from './ingestActionTypes';
import {getIngestById} from './ingestSelectors';
import {getFiltersToSend} from './utils';
import FilterConstants from './constants';
import Constants from '../constants';

const {PAGE_SIZE, sortParams, AVAIL_HISTORY_ID, INGEST_HISTORY_ATTACHMENT_ID} = Constants;
const {
    URLFilterKeys,
    ingestTypes: {EMAIL},
    filterKeys: {FILE_NAME},
} = FilterConstants;
const UPLOAD_SUCCESS_MESSAGE = 'You have successfully uploaded an Avail.';
const UPLOAD_DELAY = 7500;
const UPLOAD_DELAY_2 = 2000;

function* fetchIngests({payload}) {
    try {
        const page = parseInt(URL.getParamIfExists('page') || 0);

        const filters = {};
        Object.keys(URLFilterKeys).forEach(key => {
            filters[URLFilterKeys[key]] = payload[key];
        });
        filters.page = page;
        if (filters[URLFilterKeys.ingestType] !== EMAIL.toUpperCase()) {
            delete filters[URLFilterKeys.emailSubject];
        }
        const url = `${window.location.pathname}?${URL.updateQueryParam(filters)}`;
        yield put(push(URL.keepEmbedded(url)));
        yield put({
            type: actionTypes.FILTER_LOADING,
            payload: true,
        });
        payload[FILE_NAME] = payload[FILE_NAME].replaceAll(' ', '_');

        const response = yield call(historyService.advancedSearch, payload, 0, PAGE_SIZE * (page + 1), sortParams);
        const {data, total} = response || {};
        yield put({
            type: actionTypes.FETCH_INGESTS_SUCCESS,
            payload: {data: normalizeDataForStore(data), total},
        });

        yield put({
            type: actionTypes.FILTER_LOADING,
            payload: false,
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_INGESTS_ERROR,
        });
        yield put({
            type: actionTypes.FILTER_LOADING,
            payload: false,
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
        const {data} = response || {};
        yield put({
            type: actionTypes.FETCH_NEXT_PAGE_SUCCESS,
            payload: normalizeDataForStore(data),
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_NEXT_PAGE_ERROR,
        });
    }
}

function* filterRightsByStatus({payload}) {
    const queryParam = payload === FilterConstants.REPORT.total.value ? undefined : {status: payload};

    if (queryParam) {
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
        },
    });
}

function* selectIngest({payload}) {
    const {availHistoryId, attachmentId} = payload || {};
    let ingestId = availHistoryId;
    const queryParam = {[AVAIL_HISTORY_ID]: ingestId, [INGEST_HISTORY_ATTACHMENT_ID]: attachmentId};

    if (ingestId) {
        const url = `${window.location.pathname}?${URL.updateQueryParam(queryParam)}`;
        yield put(push(URL.keepEmbedded(url)));
        yield put({
            type: SET_RIGHTS_FILTER,
            payload: {},
        });
        yield put({
            type: ADD_RIGHTS_FILTER,
            payload: {external: queryParam},
        });

        if (!attachmentId) {
            yield put({
                type: REMOVE_RIGHTS_FILTER,
                payload: {
                    filter: INGEST_HISTORY_ATTACHMENT_ID,
                },
            });
        } else {
            yield put({
                type: actionTypes.UPDATE_SELECTED_ATTACHMENT_ID,
                payload: attachmentId,
            });
        }
    } else {
        const params = new URLSearchParams(window.location.search.substring(1));
        ingestId = params.get(Constants.AVAIL_HISTORY_ID);
    }
    if (ingestId) {
        let selectedIngest = yield select(getIngestById, ingestId);

        try {
            if (!selectedIngest) {
                selectedIngest = yield call(historyService.getHistory, ingestId);
            }
            yield put({
                type: actionTypes.UPDATE_SELECTED_INGEST,
                payload: selectedIngest,
            });
        } catch (error) {
            yield put({
                type: 'DESELECT_INGEST',
            });
        }
    }
}

function* deselectIngest() {
    yield put({
        type: REMOVE_RIGHTS_FILTER,
        payload: {
            filter: 'status',
        },
    });
    const url = `${window.location.pathname}`;
    yield put(push(URL.keepEmbedded(url)));
    yield put({
        type: REMOVE_RIGHTS_FILTER,
        payload: {
            filter: INGEST_HISTORY_ATTACHMENT_ID,
        },
    });
    yield put({
        type: REMOVE_RIGHTS_FILTER,
        payload: {
            filter: AVAIL_HISTORY_ID,
        },
    });
    yield put({
        type: actionTypes.CLEAR_SELECTED_INGEST,
    });
}

function* uploadIngest({payload}) {
    const {file, closeModal, ...rest} = payload || {};

    try {
        yield put({
            type: actionTypes.UPLOAD_INGEST_REQUEST,
            payload: {},
        });

        const response = yield uploadService.uploadAvail({file, params: rest});
        yield delay(UPLOAD_DELAY);
        yield put({
            type: actionTypes.FETCH_INGESTS,
            payload: getFiltersToSend(),
        });
        closeModal();
        yield put({
            type: ADD_TOAST,
            payload: {
                severity: SUCCESS_ICON,
                detail: `${UPLOAD_SUCCESS_MESSAGE} ${response.fileName}`,
            },
        });
        yield put({
            type: actionTypes.UPLOAD_INGEST_SUCCESS,
            payload: {},
        });
        yield delay(UPLOAD_DELAY_2);
        yield put({
            type: actionTypes.FETCH_INGESTS,
            payload: getFiltersToSend(),
        });
    } catch (e) {
        yield put({
            type: actionTypes.UPLOAD_INGEST_ERROR,
            payload: {},
        });
    }
}

function* downloadIngestEmail({payload}) {
    if (!payload.id) {
        return;
    }

    try {
        const response = yield historyService.getAvailHistoryAttachment(payload.id);
        if (response && response.downloadUrl) {
            let filename = 'Unknown';
            if (payload.link) {
                filename = payload.link.split(/([\\/])/g).pop();
            }
            const link = document.createElement('a');
            link.href = response.downloadUrl;
            link.setAttribute('download', filename);
            link.click();
        }
    } catch (error) {
        yield put({
            type: actionTypes.DOWNLOAD_INGEST_EMAIL_ERROR,
        });
    }
}

function* downloadIngestFile({payload}) {
    if (!payload.id) {
        return;
    }

    let filename = 'Unknown';
    try {
        if (payload.link) {
            filename = payload.link.split(/([\\/])/g).pop();
        }
        const response = yield historyService.getAvailHistoryAttachment(payload.id);
        if (response && response.downloadUrl) {
            const link = document.createElement('a');
            link.href = response.downloadUrl;
            link.setAttribute('download', filename);
            link.click();
        }
    } catch (error) {
        yield put({
            type: actionTypes.DOWNLOAD_INGEST_FILE_ERROR,
        });
    }
}

export default function* ingestWatcher() {
    yield all([
        takeLatest(actionTypes.DOWNLOAD_INGEST_EMAIL, downloadIngestEmail),
        takeLatest(actionTypes.DOWNLOAD_INGEST_FILE, downloadIngestFile),
        takeLatest(actionTypes.FETCH_INGESTS, fetchIngests),
        takeLatest(actionTypes.FETCH_NEXT_PAGE, fetchNextPage),
        takeLatest(actionTypes.FILTER_RIGHTS_BY_STATUS, filterRightsByStatus),
        takeLatest(actionTypes.SELECT_INGEST, selectIngest),
        takeLatest(actionTypes.DESELECT_INGEST, deselectIngest),
        takeLatest(actionTypes.UPLOAD_INGEST, uploadIngest),
    ]);
}
