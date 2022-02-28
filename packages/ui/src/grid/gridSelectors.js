import {get} from 'lodash';
import {createSelector} from 'reselect';

export const getGridState = state => get(state, ['ui', 'grid'], {});

export const getShouldGridRefresh = createSelector(getGridState, gridState =>
    get(gridState, 'shouldGridRefresh', false)
);

export const createGetGridResponseData = createSelector(getGridState, gridState => get(gridState, 'gridData', {}));
