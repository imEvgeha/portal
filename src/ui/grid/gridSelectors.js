import {createSelector} from 'reselect';
import {get} from 'lodash';

export const getGridState = state => get(state, ['ui', 'grid'], {});

export const getShouldGridRefresh = createSelector(
    getGridState,
    gridState => get(gridState, 'shouldGridRefresh', false)
);
