import {
    DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH,
    DASHBOARD_SEARCH_FORM__UPDATE_SEARCH_CRITERIA,
    DASHBOARD_SEARCH_FORM__SHOW_ADVANCED_SEARCH
} from "../constants/action-types";

const initialState = {
    useAdvancedSearch: false,
    freeTextSearch: {
        text: ''
    },
    searchCriteria: {
        availStartDate: null,
        availEndDate: null,
        title: '',
        studio: ''
    }
};

const dashboard = ( state = initialState, action) => {
    switch (action.type) {
        case DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH:
            return { ...state, freeTextSearch: {...state.freeTextSearch, ...action.payload}};
        case DASHBOARD_SEARCH_FORM__UPDATE_SEARCH_CRITERIA:
            return { ...state, searchCriteria: {...state.searchCriteria, ...action.payload}};
        case DASHBOARD_SEARCH_FORM__SHOW_ADVANCED_SEARCH:
            return { ...state, useAdvancedSearch: action.payload};
        default:
            return state;
    }
};

export default dashboard;