import {ADD_TOAST, REMOVE_TOAST} from './NexusToastNotificationActionTypes';

export const addToast = payload => ({
    type: ADD_TOAST,
    payload,
});

export const removeToast = index => ({
    type: REMOVE_TOAST,
    payload: index,
});
