import * as actionTypes from './rightMatchingActionTypes';

const initialState = {
    columnDefs: [],
    rowData: [],
    fieldSearchCriteria: null,
    focusedRight: null,
    rightMatchPageData: {},
    matchedRight: {},
    combinedRight: {}
};

const rightMatchingReducer = (state = initialState, action) => {
    const {type, payload = {}} = action || {};
    const {
        columnDefs, 
        fieldSearchCriteria, 
        focusedRight, 
        rightMatchPageData,
        matchedRight,
        combinedRight,
    } = payload || {};

    switch (type) {
        case actionTypes.STORE_RIGHT_MATCHING_COLUMN_DEFS:
            return {
            ...state,
            columnDefs,
        };
        case actionTypes.STORE_RIGHT_MATCHING_FIELD_SEARCH_CRITERIA:
            return {
                ...state,
                fieldSearchCriteria,
            };
        case actionTypes.STORE_FOCUSED_RIGHT:
            return {
                ...state,
                focusedRight,
            };
        case actionTypes.FETCH_MATCHED_RIGHT_SUCCESS:
            return {
                ...state,
                matchedRight,
            };
        case actionTypes.FETCH_COMBINED_RIGHT_SUCCESS:
            return {
                ...state,
                combinedRight,
            };
        case actionTypes.STORE_RIGHT_MATCH_DATA_WITH_IDS:
            return {
                ...state,
                rightMatchPageData: {
                    pages: {...state.rightMatchPageData.pages, ...rightMatchPageData.pages},
                    total: rightMatchPageData.total
                }
            };
        case actionTypes.CLEAN_STORED_RIGHT_MATCH_DATA_WITH_IDS:
            return {
                ...state,
                rightMatchPageData: {},
            };
        default:
            return state;
    }
};

export default rightMatchingReducer;

