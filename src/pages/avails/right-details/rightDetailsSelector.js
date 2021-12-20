import {createSelector} from 'reselect';

const getRightDetailsOptionsReducer = state => {
    const {avails = {}} = state || {};
    return avails.rightDetailsOptions;
};

export const areValidSelector = () =>
    createSelector(getRightDetailsOptionsReducer, rightDetailsOptions => rightDetailsOptions.areValid || true);

export const isSavingSelector = createSelector(
    getRightDetailsOptionsReducer,
    rightDetailsOptions => rightDetailsOptions.isSaving || false
);

export const isEditModeSelector = createSelector(
    getRightDetailsOptionsReducer,
    rightDetailsOptions => rightDetailsOptions.isEditMode || false
);

export const selectValuesSelector = createSelector(
    getRightDetailsOptionsReducer,
    rightDetailsOptions => rightDetailsOptions.selectValues || {}
);

export const countryOptionsSelector = createSelector(selectValuesSelector, selectValues => selectValues.country || []);

export const createIsCrewEditableSelector = () =>
    createSelector(getRightDetailsOptionsReducer, rightDetailsOptions => rightDetailsOptions.isCrewEditable || {});
