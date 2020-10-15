import {
    DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH,
    DASHBOARD_SEARCH_FORM__SET_SEARCH_CRITERIA,
    DASHBOARD_RESULT_PAGE__UPDATE,
    DASHBOARD_RESULT_PAGE__SORT,
    DASHBOARD_RESULT_PAGE__SELECT_ROW,
    DASHBOARD_RESULT_PAGE__LOADING,
    DASHBOARD_SEARCH_FORM__UPDATE_ADVANCED_SEARCH_CRITERIA,
    DASHBOARD_RESULT_PAGE__UPDATE_COLUMNS_ORDER,
    LOAD_DASHBOARD_SESSION,
    DASHBOARD_SEARCH_FORM__SHOW_ADVANCED_SEARCH,
    DASHBOARD_SEARCH_FORM__SHOW_SEARCH_RESULTS,
    DASHBOARD_SEARCH_FORM__SET_ADVANCED_SEARCH_CRITERIA,
    AVAIL__RESULTS_PAGE__SHOW_SELECTED,
    AVAIL__SET_HISTORY_CACHE,
    AVAIL__SET_BULK_EXPORT,
} from '../../../constants/action-types';

export const loadDashboardSession = state => ({type: LOAD_DASHBOARD_SESSION, payload: state});

export const searchFormUpdateTextSearch = textSearch => ({
    type: DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH,
    payload: textSearch,
});
export const searchFormSetAdvancedSearchCriteria = searchCriteria => ({
    type: DASHBOARD_SEARCH_FORM__SET_ADVANCED_SEARCH_CRITERIA,
    payload: searchCriteria,
});
export const searchFormUpdateAdvancedSearchCriteria = searchCriteria => ({
    type: DASHBOARD_SEARCH_FORM__UPDATE_ADVANCED_SEARCH_CRITERIA,
    payload: searchCriteria,
});
export const searchFormSetSearchCriteria = searchCriteria => ({
    type: DASHBOARD_SEARCH_FORM__SET_SEARCH_CRITERIA,
    payload: searchCriteria,
});
export const searchFormShowAdvancedSearch = show => ({
    type: DASHBOARD_SEARCH_FORM__SHOW_ADVANCED_SEARCH,
    payload: show,
});
export const searchFormShowSearchResults = show => ({type: DASHBOARD_SEARCH_FORM__SHOW_SEARCH_RESULTS, payload: show});

export const resultPageUpdate = results => ({type: DASHBOARD_RESULT_PAGE__UPDATE, payload: results});
export const resultPageSort = sortCriteria => ({type: DASHBOARD_RESULT_PAGE__SORT, payload: sortCriteria});
export const resultPageSelect = selection => ({type: DASHBOARD_RESULT_PAGE__SELECT_ROW, payload: selection});
export const resultPageShowSelected = show => ({type: AVAIL__RESULTS_PAGE__SHOW_SELECTED, payload: show});
export const resultPageSetBulkExport = bulk => ({type: AVAIL__SET_BULK_EXPORT, payload: bulk});
export const setHistoryCache = cache => ({type: AVAIL__SET_HISTORY_CACHE, payload: cache});
export const resultPageLoading = loading => ({type: DASHBOARD_RESULT_PAGE__LOADING, payload: loading});
export const resultPageUpdateColumnsOrder = results => ({
    type: DASHBOARD_RESULT_PAGE__UPDATE_COLUMNS_ORDER,
    payload: results,
});
