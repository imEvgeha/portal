import {ADD_TOAST} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActionTypes';
import {ERROR_ICON, SUCCESS_ICON} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import {all, call, put, takeEvery} from 'redux-saga/effects';
import * as rightActionTypes from '../avails/rights-repository/rightsActionTypes';
import PublishService from './services/PublishService';
import TitleEditorialService from './services/TitleEditorialService';
import TitleService from './services/TitleService';
import TitleTerittorialService from './services/TitleTerittorialService';
import * as actionTypes from './titleMetadataActionTypes';
import {SERIES, UPDATE_TITLE_SUCCESS, UPLOAD_SUCCESS_MESSAGE} from './constants';

const titleServiceInstance = TitleService.getInstance();
const publishServiceInstance = PublishService.getInstance();
const territoryServiceInstance = TitleTerittorialService.getInstance();
const editorialServiceInstance = TitleEditorialService.getInstance();

export function* loadParentTitle(title) {
    const {parentIds} = title?.meta;
    if (parentIds) {
        const parent = parentIds.find(e => e.contentType === SERIES);
        if (parent) {
            try {
                const response = yield call(titleServiceInstance.getById, parent.id);
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
        const response = yield call(titleServiceInstance.getById, payload.id);
        const updatedResponse = yield call(loadParentTitle, response);
        const mergedResponse = {
            ...updatedResponse.data,
            ...updatedResponse.meta,
        };
        yield put({
            type: actionTypes.GET_TITLE_SUCCESS,
            payload: mergedResponse,
        });
        yield put({
            type: actionTypes.GET_TITLE_LOADING,
            payload: false,
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        yield put({
            type: actionTypes.GET_TITLE_ERROR,
            payload: error,
        });
        yield put({
            type: actionTypes.GET_TITLE_LOADING,
            payload: false,
        });
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
        const response = yield call(publishServiceInstance.getExternalIdsById, payload.id);
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
        const response = yield call(territoryServiceInstance.getByTitleId, payload.id);
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
        const response = yield call(editorialServiceInstance.getEditorialsByTitleId, payload);
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

        const response = yield call(titleServiceInstance.update, payload);
        const updatedResponse = yield call(loadParentTitle, response);
        yield put({
            type: ADD_TOAST,
            payload: {
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
            payload: {...payload},
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

    const [response] = yield call(publishServiceInstance.syncTitle, payload);

    try {
        const newPayload = {id: response.titleId};
        if (response.status === 'failure') throw Error();

        yield call(loadExternalIds, {payload: newPayload});

        yield put({
            type: ADD_TOAST,
            payload: {
                severity: SUCCESS_ICON,
                detail: `Successfully synced to ${payload.externalSystem}!`,
            },
        });
    } catch (error) {
        yield put({
            type: ADD_TOAST,
            payload: {
                severity: ERROR_ICON,
                detail: response?.errors[0].description,
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
        const [response] = yield call(publishServiceInstance.registerTitle, payload);
        const newPayload = {id: response.titleId};

        yield call(loadExternalIds, {payload: newPayload});
        if (response.status === 'failure') throw Error();

        yield put({
            type: ADD_TOAST,
            payload: {
                severity: SUCCESS_ICON,
                detail: `Successfully published to ${payload.externalSystem}!`,
            },
        });
    } catch (err) {
        yield put({
            type: ADD_TOAST,
            payload: {
                severity: ERROR_ICON,
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

        const response = yield editorialServiceInstance.uploadMetadata({file, params: rest});
        yield put({
            type: ADD_TOAST,
            payload: {
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
                severity: ERROR_ICON,
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
