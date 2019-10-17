import {createSelector} from 'reselect';

const getTitleMatchingReducer = state => state.titleMatching;

export const getFocusedRight = createSelector(
    getTitleMatchingReducer,
    titleMatching => titleMatching.focusedRight,
);

export const getColumnDefs = createSelector(
    getTitleMatchingReducer,
    titleMatching => titleMatching.columnDefs,
);

export const getTitles = createSelector(
    getTitleMatchingReducer,
    titleMatching => titleMatching.titles,
);