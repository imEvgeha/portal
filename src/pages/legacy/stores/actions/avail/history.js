import {
    HISTORY_SEARCH_FORM__UPDATE_ADVANCED_SEARCH_CRITERIA,
    HISTORY_SEARCH_FORM__SET_ADVANCED_SEARCH_CRITERIA,
    HISTORY_SEARCH_FORM__SET_SEARCH_CRITERIA,
    LOAD_HISTORY_SESSION,
    HISTORY_RESULT_PAGE__LOADING,
    HISTORY_RESULT_PAGE__UPDATE,
} from '../../../constants/action-types';

export const loadHistorySession = state => ({type: LOAD_HISTORY_SESSION, payload: state});
export const searchFormUpdateAdvancedHistorySearchCriteria = searchCriteria => ({
    type: HISTORY_SEARCH_FORM__UPDATE_ADVANCED_SEARCH_CRITERIA,
    payload: searchCriteria,
});
export const searchFormSetAdvancedHistorySearchCriteria = searchCriteria => ({
    type: HISTORY_SEARCH_FORM__SET_ADVANCED_SEARCH_CRITERIA,
    payload: searchCriteria,
});
export const searchFormSetHistorySearchCriteria = searchCriteria => ({
    type: HISTORY_SEARCH_FORM__SET_SEARCH_CRITERIA,
    payload: searchCriteria,
});
export const resultHistoryPageLoading = loading => ({type: HISTORY_RESULT_PAGE__LOADING, payload: loading});
export const resultPageHistoryUpdate = results => ({type: HISTORY_RESULT_PAGE__UPDATE, payload: results});
