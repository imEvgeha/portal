import {createSelector} from 'reselect';

const getAvailsReducer = state => {
    const {avails = {}} = state || {};
    return avails;
};

export const createLanguagesSelector = () =>
    createSelector(getAvailsReducer, avails => avails.rightDetailsOptions.selectValues.language || []);

export const createCountrySelector = () =>
    createSelector(getAvailsReducer, avails => avails.rightDetailsOptions.selectValues.country || []);
