import * as actionTypes from './titleMatchingActionTypes';

const initialState = {
    focusedRight: {},
    columnDefs: [],
};

const titleMatchingReducer = (state = initialState, action) => {
    const {type, payload} = action || {};

    switch (type) {
        case actionTypes.FETCH_FOCUSED_RIGHT_SUCCESS:
            return {
                ...state,
                focusedRight: payload || {},
            };
        case actionTypes.STORE_COLUMN_DEFS:
            return {
                ...state,
                columnDefs: payload || [],
            };
        default:
            return state;
    }
};

export default titleMatchingReducer;
