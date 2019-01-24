import {
    METADATA_TITLE_SEARCH_FORM__UPDATE_TEXT_SEARCH,
    METADATA_TITLE_SEARCH_FORM__SET_SEARCH_CRITERIA,
    METADATA_TITLE_SEARCH_FORM__USE_ADVANCED_SEARCH,
    METADATA_TITLE_RESULT_PAGE__UPDATE,
    METADATA_TITLE_RESULT_PAGE__SORT,
    METADATA_TITLE_RESULT_PAGE__SELECT_ROW,
    METADATA_TITLE_RESULT_PAGE__LOADING,
    METADATA_TITLE_SEARCH_FORM__UPDATE_ADVANCED_SEARCH_CRITERIA,
    METADATA_TITLE_LOAD_SESSION,
    METADATA_TITLE_SEARCH_FORM__SHOW_ADVANCED_SEARCH,
    METADATA_TITLE_SEARCH_FORM__SHOW_SEARCH_RESULTS,
    METADATA_TITLE_SEARCH_FORM__SET_ADVANCED_SEARCH_CRITERIA,
} from '../constants/action-types';

export const loadTitleSession = state => ({type: METADATA_TITLE_LOAD_SESSION, payload: state});

export const searchFormUpdateTextSearch = textSearch => ({type: METADATA_TITLE_SEARCH_FORM__UPDATE_TEXT_SEARCH, payload: textSearch});
export const searchFormSetAdvancedSearchCriteria = searchCriteria => ({type: METADATA_TITLE_SEARCH_FORM__SET_ADVANCED_SEARCH_CRITERIA, payload: searchCriteria});
export const searchFormUpdateAdvancedSearchCriteria = searchCriteria => ({type: METADATA_TITLE_SEARCH_FORM__UPDATE_ADVANCED_SEARCH_CRITERIA, payload: searchCriteria});
export const searchFormSetSearchCriteria = searchCriteria => ({type: METADATA_TITLE_SEARCH_FORM__SET_SEARCH_CRITERIA, payload: searchCriteria});
export const searchFormUseAdvancedSearch = use => ({type: METADATA_TITLE_SEARCH_FORM__USE_ADVANCED_SEARCH, payload: use});
export const searchFormShowAdvancedSearch = show => ({type: METADATA_TITLE_SEARCH_FORM__SHOW_ADVANCED_SEARCH, payload: show});
export const searchFormShowSearchResults = show => ({type: METADATA_TITLE_SEARCH_FORM__SHOW_SEARCH_RESULTS, payload: show});

export const resultPageUpdate = results => ({ type: METADATA_TITLE_RESULT_PAGE__UPDATE, payload: results });
export const resultPageSort = sortCriteria => ({ type: METADATA_TITLE_RESULT_PAGE__SORT, payload: sortCriteria });
export const resultPageSelect = selection => ({ type: METADATA_TITLE_RESULT_PAGE__SELECT_ROW, payload: selection });
export const resultPageLoading = loading => ({ type: METADATA_TITLE_RESULT_PAGE__LOADING, payload: loading });