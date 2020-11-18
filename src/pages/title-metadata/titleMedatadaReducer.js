import * as actionTypes from './titleMetadataActionTypes';

const initialState = {
    title: {},
    externalIds: [],
    territoryMetadata: [],
    editorialMetadata: [],
};

const titleMetadataReducer = (state = initialState, action = {}) => {
    const {type, payload = {}} = action;
    switch (type) {
        case actionTypes.GET_TITLE_SUCCESS:
            return {
                ...state,
                title: payload,
            };
        case actionTypes.GET_TITLE_ERROR:
            return {
                ...state,
            };
        case actionTypes.GET_EXTERNAL_IDS_SUCCESS:
            return {
                ...state,
                externalIds: payload,
            };
        case actionTypes.GET_EXTERNAL_IDS_ERROR:
            return {
                ...state,
            };
        case actionTypes.GET_TERRITORY_METADATA_SUCCESS:
            return {
                ...state,
                territoryMetadata: payload,
            };
        case actionTypes.GET_TERRITORY_METADATA_ERROR:
            return {
                ...state,
            };
        case actionTypes.GET_EDITORIAL_METADATA_SUCCESS:
            return {
                ...state,
                editorialMetadata: payload,
            };
        case actionTypes.GET_EDITORIAL_METADATA_ERROR:
            return {
                ...state,
            };
        case actionTypes.UPDATE_TITLE_SUCCESS:
            return {
                ...state,
                title: payload,
            };
        case actionTypes.UPDATE_TITLE_ERROR:
            return {
                ...state,
            };
        default:
            return state;
    }
};

export default titleMetadataReducer;
