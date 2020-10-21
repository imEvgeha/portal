import {createSelector} from 'reselect';

const getDopTasksReducer = state => {
    const {dopTasks = {}} = state || {};
    return dopTasks;
};

export const createFilterModelSelector = () =>
    createSelector(getDopTasksReducer, dopTasks => dopTasks.filterModel || {});
