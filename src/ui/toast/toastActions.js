import {ADD_TOAST, REMOVE_TOAST} from './toastActionTypes';

export const addToast = payload => ({
    type: ADD_TOAST,
    payload,
});

export const removeToast = index => ({
    type: REMOVE_TOAST,
    payload: index,
});
