import {
    DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH,
    DASHBOARD_SEARCH_FORM__UPDATE_SEARCH_CRITERIA,
    DASHBOARD_SEARCH_FORM__USE_ADVANCED_SEARCH,
    DASHBOARD_RESULT_PAGE__UPDATE,
    DASHBOARD_RESULT_PAGE__SORT,
    DASHBOARD_RESULT_PAGE__LOADING
} from '../constants/action-types';

const initialState = {
    useAdvancedSearch: false,
    freeTextSearch: {
        text: ''
    },
    searchCriteria: {
        vodStartDate: null,
        vodEndDate: null,
        title: '',
        studio: ''
    },
    availTabPage: {
        pages: 0,
        avails: [{}],
        pageSize: 0,
        total: 0
    },
    availTabPageSort: [],
    availTabPageLoading: false
};

const dashboard = ( state = initialState, action) => {
    switch (action.type) {
    case DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH:
        return { ...state, freeTextSearch: {...state.freeTextSearch, ...action.payload}};
    case DASHBOARD_SEARCH_FORM__UPDATE_SEARCH_CRITERIA:
        return { ...state, searchCriteria: {...state.searchCriteria, ...action.payload}};
    case DASHBOARD_SEARCH_FORM__USE_ADVANCED_SEARCH:
        return { ...state, useAdvancedSearch: action.payload};
    case DASHBOARD_RESULT_PAGE__UPDATE:
        return { ...state, availTabPage: {...state.dashboardAvailTabPage, ...action.payload}};
    case DASHBOARD_RESULT_PAGE__SORT:
        return { ...state, availTabPageSort: action.payload};
    case DASHBOARD_RESULT_PAGE__LOADING:
        return { ...state, availTabPageLoading: action.payload};
    default:
        return state;
    }
};

export default dashboard;