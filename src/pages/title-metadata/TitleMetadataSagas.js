import {put, all, call, takeEvery} from 'redux-saga/effects';
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

export function* loadParentTitle(title) {
    const {parentIds} = title;
    if (parentIds) {
        const parent = parentIds.find(e => e.contentType === 'SERIES');
        if (parent) {
            try {
                const response = yield call(getTitleById, parent.id);
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
        const response = yield call(getTitleById, payload.id);
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
        const response = yield call(getTerritoryMetadataById, payload.id);
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
        const response = yield call(getEditorialMetadataByTitleId, payload.id);
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
        const response = yield call(updateTitleService, payload);
        const updatedResponse = yield call(loadParentTitle, response);
        yield put({
            type: actionTypes.UPDATE_TITLE_SUCCESS,
            payload: updatedResponse,
        });
    } catch (error) {
        yield put({
            type: actionTypes.UPDATE_TITLE_ERROR,
            payload: error,
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
