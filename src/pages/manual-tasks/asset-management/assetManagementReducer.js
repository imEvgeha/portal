import createAction from '../../../util/createActions';

export const FETCH_POSTERS = 'ASSET_FETCH_POSTERS';
export const STORE_POSTERS = 'ASSET_STORE_POSTERS';

export const FETCH_ASSET = 'FETCH_ASSET';
export const FETCH_ASSET_SUCCESS = 'FETCH_ASSET_SUCCESS';

export const UPLOAD_ARTWORK = 'UPLOAD_ARTWORK';
export const UPLOAD_ARTWORK_REQUEST = 'UPLOAD_ARTWORK_REQUEST';
export const UPLOAD_ARTWORK_ERROR = 'UPLOAD_ARTWORK_ERROR';
export const UPLOAD_ARTWORK_SUCCESS = 'UPLOAD_ARTWORK_SUCCESS';

export const UPLOAD_MEDIA_INGEST = 'UPLOAD_MEDIA_INGEST';
export const REMOVE_MEDIA_INGEST = 'REMOVE_MEDIA_INGEST';
export const UPLOAD_MEDIA_INGEST_SUCCESS = 'UPLOAD_MEDIA_INGEST_SUCCESS';

export const fetchPosters = createAction(FETCH_POSTERS);
export const fetchAsset = createAction(FETCH_ASSET);
export const uploadArtwork = createAction(UPLOAD_ARTWORK);
export const uploadMediaIngest = createAction(UPLOAD_MEDIA_INGEST);
export const removeMediaIngest = createAction(REMOVE_MEDIA_INGEST);

const initialState = {
    posterList: [],
    details: undefined,
    uploadedMediaIngests: [],
};

const assetManagementReducer = (state = initialState, action) => {
    switch (action.type) {
        case STORE_POSTERS:
            return {
                ...state,
                posterList: action.payload,
            };
        case FETCH_ASSET_SUCCESS:
            return {
                ...state,
                details: action.payload,
            };
        case UPLOAD_MEDIA_INGEST_SUCCESS:
            return {
                ...state,
                uploadedMediaIngests: [...state.uploadedMediaIngests, action.payload],
            };
        case REMOVE_MEDIA_INGEST:
            return {
                ...state,
                uploadedMediaIngests: [],
            };
        default:
            return state;
    }
};

export default assetManagementReducer;
