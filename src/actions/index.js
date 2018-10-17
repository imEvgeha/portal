import {
    LOAD_PROFILE_INFO,
    DASHBOARD_UPDATE_SEARCH_FORM,
    DASHBOARD_RESULT_PAGE__UPDATE,
    DASHBOARD_RESULT_PAGE__SORT,
    DASHBOARD_RESULT_PAGE__SELECT_ROW,
    DASHBOARD_RESULT_PAGE__LOADING
} from "../constants/action-types";

export const loadProfileInfo = profileInfo => ({type: LOAD_PROFILE_INFO, payload: profileInfo});