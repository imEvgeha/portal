import {createSelector} from 'reselect';

const getToast = state => state.ui.toast || {};

const getSingleToastData = state => {
  const toastWrapper = getToast(state);
  return toastWrapper.toast;
};

export const createToastSelector = () => createSelector(getSingleToastData, toast => toast);