import {
    LOAD_PROFILE_INFO,
    DASHBOARD_UPDATE_SEARCH_FORM,
    DASHBOARD_RESULT_PAGE_UPDATE,
    DASHBOARD_RESULT_PAGE_SORT,
    DASHBOARD_RESULT_PAGE_SELECT,
    DASHBOARD_RESULT_PAGE_LOADING
} from "../constants/action-types";

const initialState = {
    profileInfo: {},
    dashboardSearchCriteria: {
        searchText: '',
        availStartDate: null,
        availEndDate: null,
        title: '',
        studio: ''
    },
    dashboardAvailTabPage: {
        pages: 0,
        avails: [{}],
        pageSize: 0,
        total: 0
    },
    dashboardAvailTabPageSort: [],
    dashboardAvailTabPageSelected: [],
    dashboardAvailTabPageLoading: false
};

const rootReducer = ( state = initialState, action) => {
    switch (action.type) {
        case LOAD_PROFILE_INFO:
            return { ...state, profileInfo: action.payload};
        case DASHBOARD_UPDATE_SEARCH_FORM:
            return { ...state, dashboardSearchCriteria: {...state.dashboardSearchCriteria, ...action.searchCriteria}};
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

export default rootReducer;