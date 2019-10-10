import * as actionTypes from './titleMatchingActionTypes';

const initialState = {
    focusedRight: {}
};

const titleMatchingReducer = (state = initialState, action) => {
    const {type, payload = {}} = action || {};
    const {focusedRight} = payload || {};

    switch (type) {
        case actionTypes.FETCH_FOCUSED_RIGHT_SUCCESS:
            return {
                ...state,
                focusedRight,
            };
        default:
            return state;
    }
};

export default titleMatchingReducer;
