import {createSelector} from 'reselect';

export const getToastReducer = state => state.toastReducer;

export const getToasts = createSelector(
    getToastReducer,
    toastReducer => toastReducer.toasts,
);