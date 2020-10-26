import {createSelector} from 'reselect';

const getDopTasksReducer = state => {
    const {dopTasks = {}} = state || {};
    return dopTasks;
};

export const createGridStateSelector = () => createSelector(getDopTasksReducer, dopTasks => dopTasks.gridState || {});
