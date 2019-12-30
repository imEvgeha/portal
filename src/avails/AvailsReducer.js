import actionTypes from './availsActionTypes';

const initialState = {
    avails: [],
    total: 0
};

const availsReducer = (state = initialState, action = {}) => {
    const {type, payload = {}} = action;
    switch(type) {
        case actionTypes.FETCH_AVAILS_SUCCESS:
            return {
                ...state,
                avails: payload.data,
                total: payload.total
            };
        case actionTypes.FETCH_NEXT_PAGE_SUCCESS:
            return {
                ...state,
                avails: state.avails.concat(payload)
            };

        default:
            return state;
    }
};

export default availsReducer;

