import {
    LOAD_PROFILE_INFO,
    DASHBOARD_RESULT_PAGE_UPDATE,
    DASHBOARD_RESULT_PAGE_SORT
} from "../constants/action-types";

const initialState = {
    profileInfo: {},
    dashboardAvailTabPageSort: {
        sortBy: undefined,
        desc: undefined
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
        case DASHBOARD_RESULT_PAGE_UPDATE:
            return { ...state, dashboardAvailTabPage: action.payload};
        case DASHBOARD_RESULT_PAGE_SORT:
            return { ...state, dashboardAvailTabPageSort: action.payload};
        default:
            return state;
    }
};

export default rootReducer;