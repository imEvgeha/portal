import actionTypes from './ingestActionTypes';

const initialState = {
    ingests: [],
    totalIngests: 0,
    selectedIngest: null,
    isUploading: false,
    selectedAttachmentId: null
};

const ingestReducer = (state = initialState, action = {}) => {
    const {type, payload = {}} = action;
    switch(type) {
        case actionTypes.FETCH_INGESTS_SUCCESS:
            return {
            ...state,
            ingests: payload.data,
            totalIngests: payload.total
        };
        case actionTypes.FETCH_NEXT_PAGE_SUCCESS:
            return {
            ...state,
            ingests: state.ingests.concat(payload)
        };
        case actionTypes.UPDATE_SELECTED_INGEST:
            return {
            ...state,
            selectedIngest: payload
        };
        case actionTypes.IS_UPLOADING:
            return {
            ...state,
            isUploading: payload
        };
        case actionTypes.UPDATE_SELECTED_ATTACHMENT_ID:
            return {
                ...state,
                selectedAttachmentId: payload
            };
        case actionTypes.CLEAR_SELECTED_INGEST:
            return {
                ...state,
                selectedAttachmentId: null,
                selectedIngest: null
            };
        default:
            return state;
    }
};

export default ingestReducer;

