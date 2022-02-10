import {ADD_TOAST, REMOVE_TOAST} from './toastActionTypes';

const initialState = {
    toast: null,
};

const toastReducer = (state = initialState, action) => {
    const {type, payload} = action;
    switch (type) {
        case ADD_TOAST:
            return {
                ...state,
                toast: payload,
            };
        case REMOVE_TOAST: {
            return {
                ...state,
                toast: null,
            };
        }
        default:
            return state;
    }
};

export default toastReducer;
