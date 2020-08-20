import * as actionTypes from './rightMatchingActionTypes';

const initialState = {
    columnDefs: [],
    focusedRight: {},
    pendingRight: {},
    rightMatchPageData: {},
    matchedRights: [],
    rightsForMatching: [],
    combinedRight: {},
    mergeRights: false,
};

const rightMatchingReducer = (state = initialState, action) => {
    const {type, payload = {}} = action || {};
    const {columnDefs, focusedRight, rightMatchPageData, rightsForMatching, combinedRight, pendingRight} =
        payload || {};

    switch (type) {
        case actionTypes.STORE_RIGHT_MATCHING_COLUMN_DEFS:
            return {
                ...state,
                columnDefs,
            };
        case actionTypes.STORE_FOCUSED_RIGHT:
            return {
                ...state,
                pendingRight: {},
                focusedRight,
                mergeRights: false,
            };
        case actionTypes.STORE_PENDING_RIGHT:
            return {
                ...state,
                pendingRight,
                focusedRight: {},
                mergeRights: true,
            };
        case actionTypes.STORE_MATCHED_RIGHTS_SUCCESS:
            return {
                ...state,
                rightsForMatching,
            };
        case actionTypes.FETCH_COMBINED_RIGHT_SUCCESS:
        case actionTypes.FETCH_COMBINED_RIGHT_ERROR:
            return {
                ...state,
                combinedRight,
            };
        case actionTypes.STORE_RIGHT_MATCH_DATA_WITH_IDS:
            return {
                ...state,
                rightMatchPageData: {
                    pages: {...state.rightMatchPageData.pages, ...rightMatchPageData.pages},
                    total: rightMatchPageData.total,
                },
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
