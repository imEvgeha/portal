import * as actionTypes from './rightMatchingActionTypes';

const initialState = {
    columnDefs: [],
    fieldSearchCriteria: null,
    focusedRight: {},
    rightMatchPageData: {},
    matchedRights: [],
    combinedRight: {},
    foundFocusRightInRightsRepository: false
};

const rightMatchingReducer = (state = initialState, action) => {
    const {type, payload = {}} = action || {};
    const {
        columnDefs, 
        fieldSearchCriteria, 
        focusedRight, 
        rightMatchPageData,
        matchedRights,
        combinedRight,
        foundFocusRightInRightsRepository
    } = payload || {};

    switch (type) {
        case actionTypes.STORE_RIGHT_MATCHING_COLUMN_DEFS:
            return {
            ...state,
            columnDefs,
        };
        case actionTypes.FETCH_RIGHT_MATCHING_FIELD_SEARCH_CRITERIA_SUCCESS:
            return {
                ...state,
                fieldSearchCriteria,
            };
        case actionTypes.STORE_FOCUSED_RIGHT:
            return {
                ...state,
                focusedRight,
                foundFocusRightInRightsRepository: false,
            };
        case actionTypes.FETCH_MATCHED_RIGHT_SUCCESS:
            return {
                ...state,
                matchedRights,
            };
        case actionTypes.FETCH_COMBINED_RIGHT_SUCCESS:
            return {
                ...state,
                combinedRight,
            };
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
                    total: rightMatchPageData.total
                }
            };
        case actionTypes.CLEAN_STORED_RIGHT_MATCH_DATA_WITH_IDS:
            return {
                ...state,
                rightMatchPageData: {},
            };
        case actionTypes.FOUND_FOCUS_RIGHT_IN_RIGHTS_REPOSITORY:
            return {
                ...state,
                foundFocusRightInRightsRepository
            };
        default:
            return state;
    }
};

export default rightMatchingReducer;

