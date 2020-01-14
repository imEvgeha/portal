import * as actionTypes from './rightsActionTypes';

const initialState = {
    list: {},
    total: 0,
    selected: {},
    filter: {},
};

const rightsReducer = (state = initialState, action = {}) => {
    const {type, payload = {}} = action;

    switch (type) {
        case actionTypes.SET_SELECTED_RIGHTS:
            return {
                ...state,
                selected: payload,
            };
        case actionTypes.STORE_RIGHTS_FILTER_SUCCESS:
            return {
                ...state,
                filter: {...state.filter, ...payload},
            };
        default:
            return state;
    }
};

export default rightsReducer;
