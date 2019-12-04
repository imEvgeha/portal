import {ADD_TOAST, REMOVE_TOAST} from './actionTypes.js';

export const addToast = toast => ({
    type: ADD_TOAST,
    payload: toast,
});

export const removeToast = index => ({
    type: REMOVE_TOAST,
    payload: index,
});