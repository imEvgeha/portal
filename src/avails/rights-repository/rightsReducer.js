import * as actionTypes from './rightsActionTypes';

const initialState = {
    list: {},
    total: 0,
    selected: {},
};

const rightsReducer = (state = initialState, action = {}) => {
    const {type, payload = {}} = action;

    switch (type) {
        case actionTypes.SET_SELECTED_RIGHTS:
            return {
                ...state,
                selected: payload,
            };
        default:
            return state;
    }
};

export default rightsReducer;
