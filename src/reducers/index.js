import {
    LOAD_PROFILE_INFO,
    DASHBOARD_RESULT_PAGE_UPDATE
} from "../constants/action-types";

const initialState = {
    profileInfo: {},
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
        default:
            return state;
    }
};

export default rootReducer;