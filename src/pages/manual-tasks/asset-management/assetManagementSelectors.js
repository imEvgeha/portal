import {createSelector} from 'reselect';

const getManualTasks = state => {
    const {manualTasks = {}} = state || {};
    return manualTasks;
};

const getAssetManagementReducer = createSelector(getManualTasks, tasks => {
    const {assets = {}} = tasks || {};
    return assets;
});

export const posterListSelector = createSelector(getAssetManagementReducer, assets => assets?.posterList);
export const assetDetailsSelector = createSelector(getAssetManagementReducer, assets => assets?.details);
export const mediaIngestsSelector = createSelector(getAssetManagementReducer, assets => assets?.uploadedMediaIngests);
