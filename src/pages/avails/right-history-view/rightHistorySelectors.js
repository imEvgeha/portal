import {createSelector} from 'reselect';

const getRightHistoryReducer = (state) => state.avails.rightHistory || {};

export const getRightsEventHistorySelector = () => createSelector(
    getRightHistoryReducer,
    rightHistory => rightHistory.rightsEventHistory
);
