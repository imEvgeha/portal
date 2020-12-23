import {createSelector} from 'reselect';

export const getToastReducer = state => state.ui.toast || {};

export const getToasts = createSelector(getToastReducer, toastReducer => toastReducer.list);
