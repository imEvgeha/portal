import {isNumber} from 'lodash';
import {ADD_TOAST, REMOVE_TOAST} from './NexusToastNotificationActionTypes';

const initialState = {
    toast: [],
};

const toastReducer = (state = initialState, action) => {
    const {type, payload} = action;
    switch (type) {
        case ADD_TOAST:
            return {
                ...state,
                toast: [payload],
            };
        case REMOVE_TOAST: {
            const updatedToastsArray = [...state.toast];
            isNumber(payload) && updatedToastsArray.splice(payload, 1);
            return {
                ...state,
                toast: isNumber(payload) ? updatedToastsArray : [],
            };
        }
        default:
            return state;
    }
};

export default toastReducer;
