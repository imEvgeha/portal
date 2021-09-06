import {
    METADATA_TITLE_SEARCH_FORM__SET_SEARCH_CRITERIA,
    METADATA_TITLE_RESULT_PAGE__UPDATE,
    METADATA_TITLE_RESULT_PAGE__LOADING,
    METADATA_TITLE_CONFIG__LOAD,
} from '../../../constants/action-types';

export const searchFormSetSearchCriteria = searchCriteria => ({
    type: METADATA_TITLE_SEARCH_FORM__SET_SEARCH_CRITERIA,
    payload: searchCriteria,
});

export const resultPageUpdate = results => ({type: METADATA_TITLE_RESULT_PAGE__UPDATE, payload: results});
export const resultPageLoading = loading => ({type: METADATA_TITLE_RESULT_PAGE__LOADING, payload: loading});

export const loadConfigData = (configKey, results) => ({
    type: METADATA_TITLE_CONFIG__LOAD,
    configKey: configKey,
    payload: results,
});
