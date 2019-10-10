import * as actionTypes from './rightMatchingActionTypes';

const initialState = {
    columnDefs: [],
    rightMatchPageData: {},
    focusedRight: {},
    matchedRight: {},
    combinedRight: {}
};

const rightMatchingReducer = (state = initialState, action) => {
    const {type, payload = {}} = action || {};
    const {columnDefs} = payload || {};
    const {focusedRight} = payload || {};
    const {matchedRight} = payload || {};
    const {combinedRight} = payload || {};
    const {rightMatchPageData} = payload || [];

    switch (type) {
        case actionTypes.STORE_RIGHT_MATCHING_COLUMN_DEFS:
            return {
            ...state,
            columnDefs,
        };
        case actionTypes.FETCH_FOCUSED_RIGHT_SUCCESS:
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
                rightMatchPageData: {}
            };
        default:
            return state;
    }
};

export default rightMatchingReducer;
