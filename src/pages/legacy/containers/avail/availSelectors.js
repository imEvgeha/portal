import {createSelector} from 'reselect';

const getSelectValues = state => {
    const {root} = state;
    return root && root.selectValues;
};

export const createAvailSelectValuesSelector = () => createSelector(getSelectValues, selectValues => selectValues);
