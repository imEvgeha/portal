import {createSelector} from 'reselect';

const getLocaleReducer = state => state.locale;
export const getLocale = createSelector(getLocaleReducer, localeReducer => localeReducer.locale);
