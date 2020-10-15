import * as actionTypes from './ingestActionTypes';

const initialState = {
    list: {},
    page: 0,
    size: 0,
    total: 0,
    selectedIngestId: null,
    selectedAttachmentId: null,
};

const ingestReducer = (state = initialState, action = {}) => {
    const {type, payload = {}} = action;
    switch (type) {
        case actionTypes.FETCH_INGESTS_SUCCESS:
            return {
                ...state,
                list: payload.data,
                total: payload.total,
            };
        case actionTypes.FETCH_NEXT_PAGE_SUCCESS:
            return {
                ...state,
                list: {
                    ...state.list,
                    ...payload,
                },
            };
        case actionTypes.UPDATE_SELECTED_INGEST:
            return {
                ...state,
                selectedIngestId: payload.id,
            };
        case actionTypes.UPDATE_SELECTED_ATTACHMENT_ID:
            return {
                ...state,
                selectedAttachmentId: payload,
            };
        case actionTypes.CLEAR_SELECTED_INGEST:
            return {
                ...state,
                selectedAttachmentId: null,
                selectedIngestId: null,
            };
        default:
            return state;
    }
};

export default ingestReducer;
