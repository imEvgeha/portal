import {createSelector} from 'reselect';

const getRightHistoryReducer = (state) => state.rightHistory;

export const getRightsEventHistorySelector = () => createSelector(
    getRightHistoryReducer,
    rightHistory => rightHistory.rightsEventHistory
);