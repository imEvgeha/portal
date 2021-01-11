import {createSelector} from 'reselect';

const getAssetManagementReducer = state => state.assetManagement;

export const getPosterList = createSelector(getAssetManagementReducer, assets => assets.posterList);
