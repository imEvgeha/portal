import {
    DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH,
    DASHBOARD_SEARCH_FORM__UPDATE_SEARCH_CRITERIA,
    DASHBOARD_SEARCH_FORM__SHOW_ADVANCED_SEARCH
} from "../constants/action-types";

export const searchFormUpdateTextSearch = textSearch => ({type: DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH, payload: textSearch});
export const searchFormUpdateSearchCriteria = searchCriteria => ({type: DASHBOARD_SEARCH_FORM__UPDATE_SEARCH_CRITERIA, payload: searchCriteria});
export const searchFormShowAdvancedSearch = show => ({type: DASHBOARD_SEARCH_FORM__SHOW_ADVANCED_SEARCH, payload: show});