import {
    SUCCESS_ICON,
    SUCCESS_TITLE,
    ERROR_TITLE,
    ERROR_ICON,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants';
import {ADD_TOAST} from '@vubiquity-nexus/portal-ui/lib/toast/toastActionTypes';
import {put, all, call, takeEvery} from 'redux-saga/effects';
import {history} from '../../index';
import {showToastForErrors} from '../../util/http-client/handleError';
import * as rightActionTypes from '../avails/rights-repository/rightsActionTypes';
import {uploadService} from './service/UploadService';
import * as actionTypes from './titleMetadataActionTypes';
import {
    getTitleById,
    getExternalIds,
    getTerritoryMetadataById,
    getEditorialMetadataByTitleId,
    updateTitle as updateTitleService,
    syncTitle as syncTitleService,
    registerTitle,
} from './titleMetadataServices';
import {isMgmTitle} from './utils';
import {UPDATE_TITLE_SUCCESS, UPDATE_TITLE_ERROR, UPLOAD_SUCCESS_MESSAGE, METADATA_UPLOAD_ERROR_TITLE} from './constants';

export function* loadParentTitle(title) {
    const {parentIds} = title;
    if (parentIds) {
        const parent = parentIds.find(e => e.contentType === 'SERIES');
        if (parent) {
            try {
                const isMgm = isMgmTitle(parent.id);
                const response = yield call(getTitleById, {id: parent.id, isMgm});
                const newEpisodic = Object.assign(title.episodic, {
                    seriesTitleName: response.title,
                });
                return Object.assign(title, {
                    episodic: newEpisodic,
                });
            } catch (error) {
                yield put({
                    type: actionTypes.GET_TITLE_ERROR,
                    payload: error,
                });
            }
        }
    }
    return title;
}

export function* loadTitle({payload}) {
    if (!payload.id) {
        return;
    }
    yield put({
        type: actionTypes.GET_TITLE_LOADING,
        payload: true,
    });

    try {
        const response = yield call(getTitleById, {id: payload.id, isMgm: payload.isMgm});
        const updatedResponse = yield call(loadParentTitle, response);
        yield put({
            type: actionTypes.GET_TITLE_SUCCESS,
            payload: updatedResponse,
        });
        yield put({
            type: actionTypes.GET_TITLE_LOADING,
            payload: false,
        });
    } catch (error) {
        const {bindingResult} = error.message;

        yield put({
            type: actionTypes.GET_TITLE_ERROR,
            payload: error,
        });
        yield put({
            type: actionTypes.GET_TITLE_LOADING,
            payload: false,
        });

        showToastForErrors({
            errorToast: {
                description: bindingResult,
            },
        });

        history.push('/metadata');
    }
}

export function* loadExternalIds({payload}) {
    if (!payload.id) {
        return;
    }

    yield put({
        type: actionTypes.GET_EXTERNAL_IDS_LOADING,
        payload: true,
    });

    try {
        const response = yield call(getExternalIds, payload.id);
        yield put({
            type: actionTypes.GET_EXTERNAL_IDS_SUCCESS,
            payload: response,
        });
    } catch (error) {
        yield put({
            type: actionTypes.GET_EXTERNAL_IDS_ERROR,
            payload: error,
        });
    }
}

export function* loadTerritoryMetadata({payload}) {
    if (!payload.id) {
        return;
    }

    try {
        const response = yield call(getTerritoryMetadataById, {id: payload.id, isMgm: payload.isMgm});
        yield put({
            type: actionTypes.GET_TERRITORY_METADATA_SUCCESS,
            payload: response,
        });
    } catch (error) {
        yield put({
            type: actionTypes.GET_TERRITORY_METADATA_ERROR,
            payload: error,
        });
    }
}

export function* loadEditorialMetadata({payload}) {
    if (!payload.id) {
        return;
    }
    yield put({
        type: actionTypes.GET_EDITORIAL_METADATA_LOADING,
        payload: true,
    });

    try {
        const response = yield call(getEditorialMetadataByTitleId, {id: payload.id, isMgm: payload.isMgm});
        yield put({
            type: actionTypes.GET_EDITORIAL_METADATA_SUCCESS,
            payload: response,
        });
        yield put({
            type: actionTypes.GET_EDITORIAL_METADATA_LOADING,
            payload: false,
        });
    } catch (error) {
        yield put({
            type: actionTypes.GET_EDITORIAL_METADATA_ERROR,
            payload: error,
        });
        yield put({
            type: actionTypes.GET_EDITORIAL_METADATA_LOADING,
            payload: false,
        });
    }
}

export function* updateTitle({payload}) {
    if (!payload.id) {
        return;
    }

    try {
        yield put({
            type: rightActionTypes.SAVING,
            payload: true,
        });

        const response = yield call(updateTitleService, payload);
        const updatedResponse = yield call(loadParentTitle, response);
        yield put({
            type: ADD_TOAST,
            payload: {
                summary: SUCCESS_TITLE,
                severity: SUCCESS_ICON,
                detail: UPDATE_TITLE_SUCCESS,
            },
        });
        yield put({
            type: actionTypes.UPDATE_TITLE_SUCCESS,
            payload: updatedResponse,
        });
        yield put({
            type: rightActionTypes.SAVING,
            payload: false,
        });
        yield put({
            type: actionTypes.EDITING,
            payload: false,
        });
    } catch (error) {
        yield put({
            type: ADD_TOAST,
            payload: {
                summary: ERROR_TITLE,
                severity: ERROR_ICON,
                sticky: true,
                detail: UPDATE_TITLE_ERROR,
            },
        });
        yield put({
            type: actionTypes.UPDATE_TITLE_ERROR,
            payload: error,
        });

        yield put({
            type: rightActionTypes.SAVING,
            payload: false,
        });
    } finally {
        const isMgm = isMgmTitle(payload.id);
        yield put({
            type: actionTypes.GET_TITLE,
            payload: {...payload, isMgm},
        });
    }
}

export function* syncTitle({payload}) {
    if (!payload.id) {
        return;
    }

    yield put({
        type: actionTypes.TITLE_IS_SYNCING_START,
        payload: payload.externalSystem,
    });

    try {
        const [response] = yield call(syncTitleService, payload);
        const newPayload = {id: response.titleId};
        if (response.status === 'failure') throw Error();

        yield call(loadExternalIds, {payload: newPayload});

        yield put({
            type: ADD_TOAST,
            payload: {
                summary: 'Publish title',
                severity: SUCCESS_ICON,
                detail: `Successfully synced to ${payload.externalSystem}!`,
            },
        });
    } catch (err) {
        yield put({
            type: ADD_TOAST,
            payload: {
                summary: 'Title Sync',
                severity: ERROR_ICON,
                sticky: true,
                detail: err.message,
            },
        });
    } finally {
        yield put({
            type: actionTypes.TITLE_IS_SYNCING_END,
            payload: payload.externalSystem,
        });
    }
}

export function* publishTitle({payload}) {
    if (!payload.id) {
        return;
    }

    yield put({
        type: actionTypes.TITLE_IS_PUBLISHING_START,
        payload: payload.externalSystem,
    });

    try {
        const [response] = yield call(registerTitle, payload);
        const newPayload = {id: response.titleId};

        yield call(loadExternalIds, {payload: newPayload});
        if (response.status === 'failure') throw Error();

        yield put({
            type: ADD_TOAST,
            payload: {
                summary: 'Publish title',
                severity: SUCCESS_ICON,
                detail: `Successfully published to ${payload.externalSystem}!`,
            },
        });
    } catch (err) {
        yield put({
            type: ADD_TOAST,
            payload: {
                summary: 'Publish title',
                severity: ERROR_ICON,
                sticky: true,
                detail: 'Unable to publish',
            },
        });
    } finally {
        yield put({
            type: actionTypes.TITLE_IS_PUBLISHING_END,
            payload: payload.externalSystem,
        });
    }
}

function* uploadMetadata({payload}) {
    const {file, ...rest} = payload || {};
    try {
        yield put({
            type: actionTypes.UPLOAD_METADATA_REQUEST,
            payload: {},
        });

        const response = yield uploadService.uploadMetadata({file, params: rest});
        yield put({
            type: ADD_TOAST,
            payload: {
                summary: SUCCESS_TITLE,
                severity: SUCCESS_ICON,
                detail: `${UPLOAD_SUCCESS_MESSAGE} ${response.id}`,
            },
        });

        yield put({
            type: actionTypes.UPLOAD_METADATA_SUCCESS,
            payload: {},
        });
    } catch (e) {
        yield put({
            type: actionTypes.UPLOAD_METADATA_ERROR,
            payload: {},
        });

        yield put({
            type: ADD_TOAST,
            payload: {
                summary: METADATA_UPLOAD_ERROR_TITLE,
                severity: ERROR_ICON,
                sticky: true,
                detail: `Type: ${e.type}`,
            },
        });
    }
}

export function* titleMetadataWatcher() {
    yield all([
        takeEvery(actionTypes.GET_TITLE, loadTitle),
        takeEvery(actionTypes.GET_EXTERNAL_IDS, loadExternalIds),
        takeEvery(actionTypes.GET_TERRITORY_METADATA, loadTerritoryMetadata),
        takeEvery(actionTypes.GET_EDITORIAL_METADATA, loadEditorialMetadata),
        takeEvery(actionTypes.UPDATE_TITLE, updateTitle),
        takeEvery(actionTypes.SYNC_TITLE, syncTitle),
        takeEvery(actionTypes.PUBLISH_TITLE, publishTitle),
        takeEvery(actionTypes.UPLOAD_METADATA, uploadMetadata),
    ]);
}
