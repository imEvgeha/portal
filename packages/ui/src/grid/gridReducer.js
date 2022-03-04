import {TOGGLE_REFRESH_GRID_DATA} from './gridActionTypes';

const initialState = {
    shouldGridRefresh: false,
};

const gridReducer = (state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {
        case TOGGLE_REFRESH_GRID_DATA:
            return {
                ...state,
                shouldGridRefresh: payload,
            };
        default:
            return state;
    }
};
