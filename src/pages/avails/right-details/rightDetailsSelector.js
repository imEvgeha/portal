import {createSelector} from 'reselect';

const getRightDetailsOptionsReducer = state => {
    const {avails = {}} = state || {};
    return avails.rightDetailsOptions;
};

export const areValidSelector = () =>
    createSelector(getRightDetailsOptionsReducer, rightDetailsOptions => rightDetailsOptions.areValid);

export const selectValuesSelector = () =>
    createSelector(getRightDetailsOptionsReducer, rightDetailsOptions => rightDetailsOptions.selectValues);
