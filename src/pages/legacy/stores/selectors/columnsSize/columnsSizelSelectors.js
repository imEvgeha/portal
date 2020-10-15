import {createSelector} from 'reselect';

const getColumnsSize = state => {
    const {root} = state;
    return root && root.columnsSize;
};

export const createColumnsSizeSelector = () => createSelector(getColumnsSize, columnsSize => columnsSize);
