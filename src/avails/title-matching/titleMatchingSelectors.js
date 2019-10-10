import {createSelector} from 'reselect';

const getTitleMatchingReducer = state => state.titleMatching;

export const getFocusedRight = createSelector(
    getTitleMatchingReducer,
    titleMatching => titleMatching.focusedRight,
);