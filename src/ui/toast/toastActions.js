import uid from 'react-uid';
import {ADD_TOAST, REMOVE_TOAST} from './toastActionTypes.js';

export const addToast = payload => ({
    type: ADD_TOAST,
    payload,
});

export const removeToast = index => ({
    type: REMOVE_TOAST,
    payload: index,
});
