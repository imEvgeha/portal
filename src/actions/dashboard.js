import {
    DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH,
    DASHBOARD_SEARCH_FORM__UPDATE_SEARCH_CRITERIA,
    DASHBOARD_SEARCH_FORM__USE_ADVANCED_SEARCH,
    DASHBOARD_RESULT_PAGE__UPDATE,
    DASHBOARD_RESULT_PAGE__SORT,
    DASHBOARD_RESULT_PAGE__SELECT_ROW,
    DASHBOARD_RESULT_PAGE__LOADING
} from '../constants/action-types';

export const searchFormUpdateTextSearch = textSearch => ({type: DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH, payload: textSearch});
export const searchFormUpdateSearchCriteria = searchCriteria => ({type: DASHBOARD_SEARCH_FORM__UPDATE_SEARCH_CRITERIA, payload: searchCriteria});
export const searchFormUseAdvancedSearch = use => ({type: DASHBOARD_SEARCH_FORM__USE_ADVANCED_SEARCH, payload: use});

export const resultPageUpdate = results => ({ type: DASHBOARD_RESULT_PAGE__UPDATE, payload: results });
export const resultPageSort = sortCriteria => ({ type: DASHBOARD_RESULT_PAGE__SORT, payload: sortCriteria });
export const resultPageSelect = selection => ({ type: DASHBOARD_RESULT_PAGE__SELECT_ROW, payload: selection });
export const resultPageLoading = loading => ({ type: DASHBOARD_RESULT_PAGE__LOADING, payload: loading });