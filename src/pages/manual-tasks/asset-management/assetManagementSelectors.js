import {createSelector} from 'reselect';

const getManualTasks = state => {
    const {manualTasks = {}} = state || {};
    return manualTasks;
};

const getAssetManagementReducer = createSelector(getManualTasks, tasks => {
    const {assets = {}} = tasks || {};
    return assets;
});

export const getPosterList = createSelector(getAssetManagementReducer, assets => assets?.posterList);
