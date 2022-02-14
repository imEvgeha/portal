import {createSelector} from 'reselect';

export const getToastReducer = state => state.ui.toast || {};

export const getToasts = createSelector(getToastReducer, toast => toast.toast);
