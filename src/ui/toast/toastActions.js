import {ADD_TOAST, REMOVE_TOAST} from './toastActionTypes.js';

export const addToast = toast => ({
    type: ADD_TOAST,
    payload: toast,
});

export const removeToast = index => ({
    type: REMOVE_TOAST,
    payload: index,
});
