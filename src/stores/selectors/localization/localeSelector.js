import {createSelector} from 'reselect';

const getLocaleReducer = state => state.localeReducer;
export const getLocale = createSelector(
    getLocaleReducer,
    localeReducer => localeReducer.locale,
);