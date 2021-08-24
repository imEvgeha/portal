import {createSelector} from 'reselect';

const getAssetManagementReducer = state => {
    const {assets = {}} = state || {};
    return assets;
};
export const getPosterList = createSelector(getAssetManagementReducer, assets => assets.posterList);
