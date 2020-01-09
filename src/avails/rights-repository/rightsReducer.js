import * as actionTypes from './rightsActionTypes';

const initialState = {
    list: {},
    total: 0,
    selected: {},
};

const rightsReducer = (state = initialState, action = {}) => {
    switch (state, action) {
        case actionTypes.UPDATE_RIGHTS:
            return {
                ...state,
                selected: payload,
            };
        default:
            return state;
    }
};

export default rightsReducer;
