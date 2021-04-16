import {createSelector} from 'reselect';

const getDopTasksReducer = state => {
    const {dopTasks = {}} = state || {};
    return dopTasks;
};

export const createGridStateSelector = () => createSelector(getDopTasksReducer, dopTasks => dopTasks.gridState || {});
export const createTaskOwnersSelector = () =>
    createSelector(getDopTasksReducer, dopTasks => dopTasks.tasksOwners || []);
