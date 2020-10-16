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
    METADATA_TITLE_LOAD_PROFILE_INFO,
    METADATA_TITLE_LOAD_TITLE_MAPPING,
    METADATA_TITLE_LOAD_REPORTS,
    METADATA_TITLE_SET_REPORT_NAME,
    METADATA_TITLE_UPDATE_BREADCRUMB,
    METADATA_TITLE_RESULT_PAGE__UPDATE_COLUMNS_ORDER,
    TERRITORY_METADATA_ADD,
    TERRITORY_METADATA_LOAD_BY_ID,
    METADATA_TITLE_CONFIG__LOAD,
} from '../../../constants/action-types';

export const searchFormUpdateTextSearch = textSearch => ({
    type: METADATA_TITLE_SEARCH_FORM__UPDATE_TEXT_SEARCH,
    payload: textSearch,
});
export const searchFormSetAdvancedSearchCriteria = searchCriteria => ({
    type: METADATA_TITLE_SEARCH_FORM__SET_ADVANCED_SEARCH_CRITERIA,
    payload: searchCriteria,
});
export const searchFormUpdateAdvancedSearchCriteria = searchCriteria => ({
    type: METADATA_TITLE_SEARCH_FORM__UPDATE_ADVANCED_SEARCH_CRITERIA,
    payload: searchCriteria,
});
export const searchFormSetSearchCriteria = searchCriteria => ({
    type: METADATA_TITLE_SEARCH_FORM__SET_SEARCH_CRITERIA,
    payload: searchCriteria,
});
export const searchFormUseAdvancedSearch = use => ({
    type: METADATA_TITLE_SEARCH_FORM__USE_ADVANCED_SEARCH,
    payload: use,
});
export const searchFormShowAdvancedSearch = show => ({
    type: METADATA_TITLE_SEARCH_FORM__SHOW_ADVANCED_SEARCH,
    payload: show,
});
export const searchFormShowSearchResults = show => ({
    type: METADATA_TITLE_SEARCH_FORM__SHOW_SEARCH_RESULTS,
    payload: show,
});

export const resultPageUpdate = results => ({type: METADATA_TITLE_RESULT_PAGE__UPDATE, payload: results});
export const resultPageSort = sortCriteria => ({type: METADATA_TITLE_RESULT_PAGE__SORT, payload: sortCriteria});
export const resultPageSelect = selection => ({type: METADATA_TITLE_RESULT_PAGE__SELECT_ROW, payload: selection});
export const resultPageLoading = loading => ({type: METADATA_TITLE_RESULT_PAGE__LOADING, payload: loading});

export const loadTitleSession = state => ({type: METADATA_TITLE_LOAD_SESSION, payload: state});
export const loadProfileInfo = profileInfo => ({type: METADATA_TITLE_LOAD_PROFILE_INFO, payload: profileInfo});
export const loadTitleMapping = titleMapping => ({type: METADATA_TITLE_LOAD_TITLE_MAPPING, payload: titleMapping});
export const loadReports = reports => ({type: METADATA_TITLE_LOAD_REPORTS, payload: reports});
export const setReportName = reportName => ({type: METADATA_TITLE_SET_REPORT_NAME, payload: reportName});
export const updateBreadcrumb = payload => ({type: METADATA_TITLE_UPDATE_BREADCRUMB, payload: payload});

export const resultPageUpdateColumnsOrder = results => ({
    type: METADATA_TITLE_RESULT_PAGE__UPDATE_COLUMNS_ORDER,
    payload: results,
});

export const addTerritoryMetadata = results => ({type: TERRITORY_METADATA_ADD, payload: results});
export const getTerritoryMetadataById = results => ({type: TERRITORY_METADATA_LOAD_BY_ID, payload: results});

export const loadConfigData = (configKey, results) => ({
    type: METADATA_TITLE_CONFIG__LOAD,
    configKey: configKey,
    payload: results,
});
