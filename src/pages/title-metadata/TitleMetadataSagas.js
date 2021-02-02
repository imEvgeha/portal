import {
    SUCCESS_ICON,
    SUCCESS_TITLE,
    ERROR_TITLE,
    ERROR_ICON,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants';
import {ADD_TOAST} from '@vubiquity-nexus/portal-ui/lib/toast/toastActionTypes';
import {put, all, call, takeEvery} from 'redux-saga/effects';
import * as rightActionTypes from '../avails/rights-repository/rightsActionTypes';
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
import {UPDATE_TITLE_SUCCESS, UPDATE_TITLE_ERROR} from './constants';

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
    try {
        const response = yield call(getTitleById, {id: payload.id, isMgm: payload.isMgm});
        const updatedResponse = yield call(loadParentTitle, response);
        yield put({
            type: actionTypes.GET_TITLE_SUCCESS,
            payload: updatedResponse,
        });
    } catch (error) {
        yield put({
            type: actionTypes.GET_TITLE_ERROR,
            payload: error,
        });
    }
}

export function* loadExternalIds({payload}) {
    if (!payload.id) {
        return;
    }

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

    try {
        const response = yield call(getEditorialMetadataByTitleId, {id: payload.id, isMgm: payload.isMgm});
        yield put({
            type: actionTypes.GET_EDITORIAL_METADATA_SUCCESS,
            payload: response,
        });
    } catch (error) {
        yield put({
            type: actionTypes.GET_EDITORIAL_METADATA_ERROR,
            payload: error,
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
                title: SUCCESS_TITLE,
                icon: SUCCESS_ICON,
                isAutoDismiss: true,
                description: UPDATE_TITLE_SUCCESS,
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
    } catch (error) {
        yield put({
            type: ADD_TOAST,
            payload: {
                title: ERROR_TITLE,
                icon: ERROR_ICON,
                isAutoDismiss: true,
                description: UPDATE_TITLE_ERROR,
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
        yield put({
            type: actionTypes.GET_TITLE,
            payload,
        });
    }
}

export function* syncTitle({payload}) {
    if (!payload.id) {
        return;
    }

    try {
        const [response] = yield call(syncTitleService, payload);
        const newPayload = {id: response.titleId};
        yield call(loadExternalIds, {payload: newPayload});
        // todo: add toast
    } catch (err) {
        // todo: add toast
    }
}

export function* publishTitle({payload}) {
    if (!payload.id) {
        return;
    }

    try {
        const [response] = yield call(registerTitle, payload);
        const newPayload = {id: response.titleId};
        yield call(loadExternalIds, {payload: newPayload});
    } catch (err) {
        // todo: add toast
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
    ]);
}
