import {
    LOAD_PROFILE_INFO,
    DASHBOARD_UPDATE_SEARCH_FORM,
    DASHBOARD_RESULT_PAGE_UPDATE,
    DASHBOARD_RESULT_PAGE_SORT,
    DASHBOARD_RESULT_PAGE_SELECT,
    DASHBOARD_RESULT_PAGE_LOADING
} from "../constants/action-types";

export const loadProfileInfo = profileInfo => ({type: LOAD_PROFILE_INFO, payload: profileInfo});
export const dashboardUpdateSearchForm = searchCriteria => ({type: DASHBOARD_UPDATE_SEARCH_FORM, searchCriteria: searchCriteria});

export const dashboardResultPageUpdate = dashboardResult => ({ type: DASHBOARD_RESULT_PAGE_UPDATE, payload: dashboardResult });
export const dashboardResultPageSort = dashboardSort => ({ type: DASHBOARD_RESULT_PAGE_SORT, payload: dashboardSort });
export const dashboardResultPageSelect = dashboardSelected => ({ type: DASHBOARD_RESULT_PAGE_SELECT, payload: dashboardSelected });
export const dashboardResultPageLoading = dashboardLoading => ({ type: DASHBOARD_RESULT_PAGE_LOADING, payload: dashboardLoading });