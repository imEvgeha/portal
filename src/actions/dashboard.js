import {
    DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH,
    DASHBOARD_SEARCH_FORM__UPDATE_SEARCH_CRITERIA,
    DASHBOARD_SEARCH_FORM__USE_ADVANCED_SEARCH,
    DASHBOARD_RESULT_PAGE__UPDATE,
    DASHBOARD_RESULT_PAGE__SORT,
    DASHBOARD_RESULT_PAGE__SELECT_ROW,
    DASHBOARD_RESULT_PAGE__LOADING,
    DASHBOARD_SEARCH_FORM__UPDATE_ADVANCED_SEARCH_CRITERIA,
    DASHBOARD_RESULT_PAGE__UPDATE_COLUMNS_ORDER,
    LOAD_DASHBOARD_SESSION,
} from '../constants/action-types';

export const loadDashboardSession = state => ({type: LOAD_DASHBOARD_SESSION, payload: state});

export const searchFormUpdateTextSearch = textSearch => ({type: DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH, payload: textSearch});
export const searchFormUpdateAdvancedSearchCriteria = searchCriteria => ({type: DASHBOARD_SEARCH_FORM__UPDATE_ADVANCED_SEARCH_CRITERIA, payload: searchCriteria});
export const searchFormUpdateSearchCriteria = searchCriteria => ({type: DASHBOARD_SEARCH_FORM__UPDATE_SEARCH_CRITERIA, payload: searchCriteria});
export const searchFormUseAdvancedSearch = use => ({type: DASHBOARD_SEARCH_FORM__USE_ADVANCED_SEARCH, payload: use});

export const resultPageUpdate = results => ({ type: DASHBOARD_RESULT_PAGE__UPDATE, payload: results });
export const resultPageSort = sortCriteria => ({ type: DASHBOARD_RESULT_PAGE__SORT, payload: sortCriteria });
export const resultPageSelect = selection => ({ type: DASHBOARD_RESULT_PAGE__SELECT_ROW, payload: selection });
export const resultPageLoading = loading => ({ type: DASHBOARD_RESULT_PAGE__LOADING, payload: loading });
export const resultPageUpdateColumnsOrder = results => ({ type: DASHBOARD_RESULT_PAGE__UPDATE_COLUMNS_ORDER, payload: results });