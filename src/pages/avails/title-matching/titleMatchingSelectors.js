import {createSelector} from 'reselect';

const getTitleMatchingReducer = state => state.avails.titleMatching || {};

export const getFocusedRight = createSelector(getTitleMatchingReducer, titleMatching => titleMatching.focusedRight);

export const getColumnDefs = createSelector(getTitleMatchingReducer, titleMatching => titleMatching.columnDefs);

export const getTitles = createSelector(getTitleMatchingReducer, titleMatching => titleMatching.titles);

export const getCombinedTitle = createSelector(getTitleMatchingReducer, titleMatching => titleMatching.combinedTitle);
