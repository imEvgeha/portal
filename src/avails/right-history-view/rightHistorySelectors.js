import {createSelector} from 'reselect';

const getRightsEventHistory = (state) => {
    const {rightHistory} = state;
    return rightHistory && rightHistory.rightsEventHistory;
};

export const getRightsEventHistorySelector = () => createSelector(
    getRightsEventHistory,
    rightsEventHistory => rightsEventHistory
);