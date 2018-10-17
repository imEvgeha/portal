import {
    LOAD_PROFILE_INFO,
    DASHBOARD_RESULT_PAGE_UPDATE,
    DASHBOARD_RESULT_PAGE_SORT,
    DASHBOARD_RESULT_PAGE_SELECT,
    DASHBOARD_RESULT_PAGE_LOADING
} from "../constants/action-types";

const initialState = {
    profileInfo: {},
    dashboardAvailTabPage: {
        pages: 0,
        avails: [{}],
        pageSize: 0,
        total: 0
    },
    dashboardAvailTabPageSort: {
        sortBy: null,
        desc: null
    },
    dashboardAvailTabPageSelected: [],
    dashboardAvailTabPageLoading: false
};

const root = ( state = initialState, action) => {
    switch (action.type) {
        case LOAD_PROFILE_INFO:
            return { ...state, profileInfo: action.payload};
        case DASHBOARD_RESULT_PAGE_UPDATE:
            return { ...state, dashboardAvailTabPage: {...state.dashboardAvailTabPage, ...action.payload}};
        case DASHBOARD_RESULT_PAGE_SORT:
            return { ...state, dashboardAvailTabPageSort: action.payload};
        case DASHBOARD_RESULT_PAGE_SELECT:
            return { ...state, dashboardAvailTabPageSelected: action.payload};
        case DASHBOARD_RESULT_PAGE_LOADING:
            return { ...state, dashboardAvailTabPageLoading: action.payload};
        default:
            return state;
    }
};

export default root;