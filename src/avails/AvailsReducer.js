import actionTypes from './availsActionTypes';

const initialState = {
  avails: [],
};

const availsReducer = (state = initialState, action = {}) => {
    const {type, payload = {}} = action;
    switch(type) {
        case actionTypes.FETCH_AVAILS_SUCCESS:
            return {
                ...state,
                avails: payload
            };

        default:
            return state;
    }
};

export default availsReducer;

