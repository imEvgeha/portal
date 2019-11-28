import {ADD_TOAST, REMOVE_TOAST} from './actionTypes.js';

const initialState = {
    toasts: [],
};

const toastReducer = (state = initialState, action) => {
    const {type, payload} = action;
    switch(type){
        case ADD_TOAST:
            return {
                ...state,
                toasts: [payload, ...state.toasts],
            };

        case REMOVE_TOAST:
            const filteredToasts = state.toasts.slice();
            filteredToasts.splice((payload || 0), 1);
            return {
                ...state,
                toasts: filteredToasts,
            };

        default:
            return state;
    }
};

export default toastReducer;