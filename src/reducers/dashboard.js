import {
    DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH,
    DASHBOARD_SEARCH_FORM__UPDATE_SEARCH_CRITERIA,
    DASHBOARD_SEARCH_FORM__USE_ADVANCED_SEARCH,
    DASHBOARD_RESULT_PAGE__UPDATE,
    DASHBOARD_RESULT_PAGE__SORT,
    DASHBOARD_RESULT_PAGE__LOADING,
    DASHBOARD_SEARCH_FORM__UPDATE_ADVANCED_SEARCH_CRITERIA,
    DASHBOARD_RESULT_PAGE__UPDATE_COLUMNS_ORDER,
} from '../constants/action-types';

const initialState = {
    useAdvancedSearch: false,
    freeTextSearch: {
        text: ''
    },
    advancedSearchCriteria: {
        // vodStartFrom: null,
        // vodStartTo: null,
        // vodEndFrom: null,
        // vodEndTo: null,
        // title: '',
        // studio: ''
    },
    columns: [],
    sortedBy: [],

    searchCriteria: {

    },
    availTabPage: {
        pages: 0,
        avails: [{}],
        pageSize: 0,
        total: 0
    },
    availTabPageSort: [],
    availTabPageLoading: false,
    columns: ['studio', 'title', 'territory', 'genre', 'vodStart', 'vodEnd']
};

const dashboard = ( state = initialState, action) => {
    switch (action.type) {
    case DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH:
        return { ...state, freeTextSearch: {...state.freeTextSearch, ...action.payload}};
    case DASHBOARD_SEARCH_FORM__UPDATE_ADVANCED_SEARCH_CRITERIA:
        return { ...state, advancedSearchCriteria: {...state.advancedSearchCriteria, ...action.payload}};
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
    case DASHBOARD_RESULT_PAGE__UPDATE_COLUMNS_ORDER:
        return { ...state, columns: action.payload};
    default:
        return state;
    }
};

export default dashboard;