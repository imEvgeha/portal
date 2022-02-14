import {ADD_TOAST} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActionTypes';
import {SUCCESS_ICON, SUCCESS_TITLE} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
// import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import {URL as VuURL} from '@vubiquity-nexus/portal-utils/lib/Common';
import DOP from '@vubiquity-nexus/portal-utils/lib/DOP';
import {isEmpty} from 'lodash';
import config from 'react-global-configuration';
import {all, call, put, takeEvery} from 'redux-saga/effects';
import {nexusFetch} from '../../../util/http-client';
import {
    FETCH_ASSET,
    FETCH_ASSET_SUCCESS,
    FETCH_POSTERS,
    STORE_POSTERS,
    UPLOAD_ARTWORK,
    UPLOAD_ARTWORK_ERROR,
    UPLOAD_ARTWORK_REQUEST,
    UPLOAD_ARTWORK_SUCCESS,
    UPLOAD_MEDIA_INGEST_SUCCESS,
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
        const {file, closeModal, tenantId, details} = payload || {};

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
                summary: SUCCESS_TITLE,
                severity: SUCCESS_ICON,
                detail: `${UPLOAD_SUCCESS_MESSAGE} ${resource.name}`,
            },
        });

        yield put({
            type: UPLOAD_ARTWORK_SUCCESS,
            payload: {},
        });
        
        const dataToSend = {
            reservationRequired: false,
            reservedAssetId: details.id,
            renditions: [
                {renditionId: details.renditions[0].id, files: [resource.id]}
          ]
        }

        const mediaIngestUrl = `${config.get('gateway.mediaIngestUrl')}/${tenantId}/assets/import`;
        const mediaIngestResource = yield call(() => nexusFetch(
            mediaIngestUrl,
            {
                method: 'post',
                body: JSON.stringify(dataToSend),
            }
        ));
        const {jobId} = mediaIngestResource;
        const artworkAssetID = VuURL.getParamIfExists('artworkAssetID', '');

        DOP.setErrorsCount(0);
        DOP.setData({
            chooseArtwork: {
                assetID: artworkAssetID,
                selectedArtworkUri: null,
                importAssetJobID: jobId,
            },
        });

        yield put({
            type: UPLOAD_MEDIA_INGEST_SUCCESS,
            payload: mediaIngestResource,
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
