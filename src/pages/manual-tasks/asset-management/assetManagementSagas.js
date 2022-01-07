import {SUCCESS_ICON, SUCCESS_TITLE} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants';
import {ADD_TOAST} from '@vubiquity-nexus/portal-ui/lib/toast/toastActionTypes';
import {get, isEmpty} from 'lodash';
import config from 'react-global-configuration';
import {call, put, all, takeEvery} from 'redux-saga/effects';
import {nexusFetch} from '../../../util/http-client';
import {
    FETCH_POSTERS,
    STORE_POSTERS,
    FETCH_ASSET,
    FETCH_ASSET_SUCCESS,
    UPLOAD_ARTWORK,
    UPLOAD_ARTWORK_REQUEST,
    UPLOAD_ARTWORK_ERROR,
    UPLOAD_ARTWORK_SUCCESS,
} from './assetManagementReducer';
import {fetchPosters} from './assetManagementService';

const UPLOAD_SUCCESS_MESSAGE = 'You have successfully uploaded Artwork.';

function* resourcePosters({payload}) {
    try {
        const url = `${config.get('gateway.mediaImageUrl')}${config.get(
            'gateway.service.mediaImageServices'
        )}/AE/assets/${payload}/posters`;
        const resource = yield call(fetchPosters, url);
        if (!isEmpty(resource)) {
            yield put({
                type: STORE_POSTERS,
                payload: resource,
            });
        }
    } catch (error) {
        // error handling here
    }
}

function* fetchAsset({payload}) {
    try {
        const url = `${config.get('gateway.kongUrl')}${config.get(
            'gateway.service.kongMediaCatalog'
        )}/AE/assets/${payload}?returnMetadataGroups=all`;

        const resource = yield call(() => nexusFetch(url));

        yield put({
            type: FETCH_ASSET_SUCCESS,
            payload: resource,
        });
    } catch (error) {
        // error handling here
    }
}

function* uploadArtwork({payload}) {
    try {
        const {file, closeModal, tenantId} = payload || {};

        yield put({
            type: UPLOAD_ARTWORK_REQUEST,
            payload: {},
        });

        const url = `${config.get('gateway.mediaStorageUrl')}/${tenantId}/files/upload`;
        const data = new FormData();
        data.append('file', file, file.name);

        const resource = yield call(() => nexusFetch(url, {method: 'post', body: data, file: true}));

        closeModal();
        yield put({
            type: ADD_TOAST,
            payload: {
                title: SUCCESS_TITLE,
                icon: SUCCESS_ICON,
                isAutoDismiss: true,
                description: `${UPLOAD_SUCCESS_MESSAGE} ${resource.name}`,
            },
        });

        yield put({
            type: UPLOAD_ARTWORK_SUCCESS,
            payload: {},
        });
    } catch (error) {
        yield put({
            type: UPLOAD_ARTWORK_ERROR,
            payload: {},
        });
    }
}

export function* assetManagementWatcher() {
    yield all([
        takeEvery(FETCH_POSTERS, resourcePosters),
        takeEvery(FETCH_ASSET, fetchAsset),
        takeEvery(UPLOAD_ARTWORK, uploadArtwork),
    ]);
}
