import {
    DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH,
    DASHBOARD_SEARCH_FORM__SET_SEARCH_CRITERIA,
    DASHBOARD_RESULT_PAGE__SORT,
    DASHBOARD_RESULT_PAGE__LOADING,
    DASHBOARD_RESULT_PAGE__UPDATE_COLUMNS_ORDER,
    DASHBOARD_SEARCH_FORM__SET_ADVANCED_SEARCH_CRITERIA,
    AVAIL__SET_BULK_EXPORT,
} from '../../../constants/action-types';

export const searchFormUpdateTextSearch = textSearch => ({
    type: DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH,
    payload: textSearch,
});
export const searchFormSetAdvancedSearchCriteria = searchCriteria => ({
    type: DASHBOARD_SEARCH_FORM__SET_ADVANCED_SEARCH_CRITERIA,
    payload: searchCriteria,
});
export const searchFormSetSearchCriteria = searchCriteria => ({
    type: DASHBOARD_SEARCH_FORM__SET_SEARCH_CRITERIA,
    payload: searchCriteria,
});

export const resultPageSort = sortCriteria => ({type: DASHBOARD_RESULT_PAGE__SORT, payload: sortCriteria});
export const resultPageSetBulkExport = bulk => ({type: AVAIL__SET_BULK_EXPORT, payload: bulk});
export const resultPageLoading = loading => ({type: DASHBOARD_RESULT_PAGE__LOADING, payload: loading});
export const resultPageUpdateColumnsOrder = results => ({
    type: DASHBOARD_RESULT_PAGE__UPDATE_COLUMNS_ORDER,
    payload: results,
});
