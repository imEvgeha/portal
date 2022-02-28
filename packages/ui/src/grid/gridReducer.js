import * as actionTypes from './gridActionTypes';

const initialState = {
    shouldGridRefresh: false,
    gridData: {},
};

const gridReducer = (state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {
        case actionTypes.TOGGLE_REFRESH_GRID_DATA:
            return {
                ...state,
                shouldGridRefresh: payload,
            };
        case actionTypes.EXPORT_GRID_RESPONSE_DATA:
            return {
                ...state,
                gridData: payload,
            };
        default:
            return state;
    }
};

export default gridReducer;
