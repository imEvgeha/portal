import {
    LOAD_PROFILE_INFO,
    DASHBOARD_UPDATE_SEARCH_FORM,
    DASHBOARD_RESULT_PAGE_UPDATE
} from "../constants/action-types";

const initialState = {
    profileInfo: {},
    dashboardSearchCriteria: {
        availStartDate: null,
        availEndDate: null,
        title: '',
        studio: ''
    },
    dashboardAvailTabPage: {
        pages: 0,
        avails: [],
        pageSize: 0,
    }
};

const rootReducer = ( state = initialState, action) => {
    switch (action.type) {
        case LOAD_PROFILE_INFO:
            return { ...state, profileInfo: action.payload};
        case DASHBOARD_UPDATE_SEARCH_FORM:
            return { ...state, dashboardSearchCriteria: {...state.dashboardSearchCriteria, ...action.searchCriteria}};
        case DASHBOARD_RESULT_PAGE_UPDATE:
            return { ...state, dashboardAvailTabPage: action.payload};
        default:
            return state;
    }
};

export default rootReducer;