import {
    LOAD_PROFILE_INFO,
    DASHBOARD_RESULT_PAGE_UPDATE,
    DASHBOARD_RESULT_PAGE_SORT
} from "../constants/action-types";

export const loadProfileInfo = profileInfo => ({type: LOAD_PROFILE_INFO, payload: profileInfo});

export const dashboardResultPageUpdate = dashboardResult => ({ type: DASHBOARD_RESULT_PAGE_UPDATE, payload: dashboardResult });
export const dashboardResultPageSort = dashboardSort => ({ type: DASHBOARD_RESULT_PAGE_SORT, payload: dashboardSort });