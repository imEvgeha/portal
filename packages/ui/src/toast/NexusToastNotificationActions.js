import {ADD_TOAST, REMOVE_TOAST} from './NexusToastNotificationActionTypes';

export const addToast = payload => ({
    type: ADD_TOAST,
    payload,
});

export const removeToast = toastId => ({
    type: REMOVE_TOAST,
    payload: toastId,
});
