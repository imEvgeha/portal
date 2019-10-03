import * as actionTypes from './rightMatchingActionTypes';

const initialState = {
    columnDefs: [],
    rowData: [],
    focusedRight: {}
};

const rightMatchingReducer = (state = initialState, action) => {
    const {type, payload = {}} = action || {};
    const {columnDefs} = payload || {};
    const {focusedRight} = payload || {};
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
        default:
            return state;
    }
};

export default rightMatchingReducer;
