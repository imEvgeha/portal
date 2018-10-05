import {
    LOAD_PROFILE_INFO,
    DASHBOARD_UPDATE_SEARCH_FORM
} from "../constants/action-types";

export const loadProfileInfo = profileInfo => ({type: LOAD_PROFILE_INFO, payload: profileInfo});
export const dashboardUpdateSearchForm = searchCriteria => ({type: DASHBOARD_UPDATE_SEARCH_FORM, searchCriteria: searchCriteria});
