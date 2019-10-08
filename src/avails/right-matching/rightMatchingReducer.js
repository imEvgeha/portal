import * as actionTypes from './rightMatchingActionTypes';

const initialState = {
    columnDefs: [],
    rowData: [],
    fieldSearchCriteria: null,
    focusedRight: null,
};

const rightMatchingReducer = (state = initialState, action) => {
    const {type, payload = {}} = action || {};
    const {columnDefs, fieldSearchCriteria, focusedRight} = payload || {};
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
        default:
            return state;
    }
};

export default rightMatchingReducer;
