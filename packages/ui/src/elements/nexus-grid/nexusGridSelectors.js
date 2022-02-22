import {createSelector} from 'reselect';

const getColumnsSize = state => {
    const {root} = state;
    return root && root.columnsSize;
};

const getSelectValues = state => {
    const {root, avails} = state;
    return avails?.rightDetailsOptions?.selectValues || root?.selectValues || [];
};

export const createColumnsSizeSelector = () => createSelector(getColumnsSize, columnsSize => columnsSize);
export const createAvailSelectValuesSelector = () => createSelector(getSelectValues, selectValues => selectValues);
