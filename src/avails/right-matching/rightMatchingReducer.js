import * as actionTypes from './rightMatchingActionTypes';

const initialState = {
    columnDefs: [],
    rightMatchPageData: {},
    focusedRight: {},
    isSuccessFlagVisible: false
};

const rightMatchingReducer = (state = initialState, action) => {
    const {type, payload = {}} = action || {};
    const {columnDefs} = payload || {};
    const {focusedRight} = payload || {};
    const {rightMatchPageData} = payload || [];
    const {isSuccessFlagVisible} = payload || [];

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
        case actionTypes.SET_RIGHT_SUCCESS_FLAG:
            return {
                ...state,
                isSuccessFlagVisible: isSuccessFlagVisible
            };
        default:
            return state;
    }
};

export default rightMatchingReducer;
