import {
    LOAD_PROFILE_INFO,
    DASHBOARD_UPDATE_SEARCH_FORM
} from "../constants/action-types";

const initialState = {
    profileInfo: {},
    dashboardSearchCriteria: {
        availStartDate: null,
        availEndDate: null,
        title: '',
        studio: ''
    }
};

const rootReducer = ( state = initialState, action) => {
    switch (action.type) {
        case LOAD_PROFILE_INFO:
            return { ...state, profileInfo: action.payload};
        case DASHBOARD_UPDATE_SEARCH_FORM:
            return { ...state, dashboardSearchCriteria: {...state.dashboardSearchCriteria, ...action.searchCriteria}};
        default:
            return state;
    }
};

export default rootReducer;