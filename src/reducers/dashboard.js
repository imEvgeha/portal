import {
    DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH,
    DASHBOARD_SEARCH_FORM__UPDATE_SEARCH_CRITERIA,
    DASHBOARD_SEARCH_FORM__USE_ADVANCED_SEARCH,
    DASHBOARD_RESULT_PAGE__UPDATE,
    DASHBOARD_RESULT_PAGE__SORT,
    DASHBOARD_RESULT_PAGE__LOADING,
    DASHBOARD_SEARCH_FORM__UPDATE_ADVANCED_SEARCH_CRITERIA,
    DASHBOARD_RESULT_PAGE__UPDATE_COLUMNS_ORDER,
    DASHBOARD_RESULT_PAGE__SELECT_ROW,
    SET_REPORT_NAME,
    LOAD_DASHBOARD_SESSION, DASHBOARD_SEARCH_FORM__SHOW_SEARCH_RESULTS, DASHBOARD_SEARCH_FORM__SHOW_ADVANCED_SEARCH,
} from '../constants/action-types';
import {saveDashboardState} from '../stores';

const initialState = {
    availTabPage: {
        pages: 0,
        avails: [],
        pageSize: 0,
        total: 0
    },
    availTabPageLoading: false,
    freeTextSearch: {
        text: ''
    },
    session: {
        availTabPageSelection: {
            selected: [],
            selectAll: false
        },
        useAdvancedSearch: false,
        showAdvancedSearch: false,
        showSearchResults: false,
        advancedSearchCriteria: {
            vodStartFrom: null,
            vodStartTo: null,
            vodEndFrom: null,
            vodEndTo: null,
            estStartFrom: null,
            estStartTo: null,
            estEndFrom: null,
            estEndTo: null,
            rowEditedFrom: null,
            rowEditedTo: null,
            rowInvalid: false,
            title: '',
            studio: '',
            releaseYear: '',
            releaseType: '',
            licensor: '',
            territory: '',
        },
        availTabPageSort: [],
        searchCriteria: {},
        reportName: '',
        columns: ['title', 'studio', 'territory', 'genres', 'vodStart', 'vodEnd'],
    }
};



const dashboard = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_DASHBOARD_SESSION:
            return { ...state, session: action.payload};
        case DASHBOARD_RESULT_PAGE__UPDATE:
            return {...state, availTabPage: {...state.availTabPage, ...action.payload}};
        case DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH:
            return { ...state, freeTextSearch: {...state.freeTextSearch, ...action.payload}};
        case DASHBOARD_RESULT_PAGE__LOADING:
            return {...state, availTabPageLoading: action.payload};
//  ------------   SESSION Actions   ----------------------------
        case SET_REPORT_NAME:
            saveDashboardState();
            return {...state, session: {...state.session, reportName: action.payload}};
        case DASHBOARD_SEARCH_FORM__UPDATE_ADVANCED_SEARCH_CRITERIA:
             saveDashboardState();
            return { ...state, session: {...state.session, advancedSearchCriteria: {...state.session.advancedSearchCriteria, ...action.payload}}};
        case DASHBOARD_SEARCH_FORM__UPDATE_SEARCH_CRITERIA:
             saveDashboardState();
            return { ...state, session: {...state.session, searchCriteria: {...state.session.searchCriteria, ...action.payload}}};
        case DASHBOARD_SEARCH_FORM__USE_ADVANCED_SEARCH:
             saveDashboardState();
            return { ...state, session: {...state.session, useAdvancedSearch: action.payload}};
        case DASHBOARD_SEARCH_FORM__SHOW_ADVANCED_SEARCH:
             saveDashboardState();
            return { ...state, session: {...state.session, showAdvancedSearch: action.payload}};
        case DASHBOARD_SEARCH_FORM__SHOW_SEARCH_RESULTS:
             saveDashboardState();
            return { ...state, session: {...state.session, showSearchResults: action.payload}};
        case DASHBOARD_RESULT_PAGE__SORT:
             saveDashboardState();
            return { ...state, session: {...state.session, availTabPageSort: action.payload}};
        case DASHBOARD_RESULT_PAGE__UPDATE_COLUMNS_ORDER:
             saveDashboardState();
            return { ...state, session: {...state.session, columns: action.payload}};
        case DASHBOARD_RESULT_PAGE__SELECT_ROW:
            saveDashboardState();
            return { ...state, session: {...state.session, availTabPageSelection: action.payload}};
        default:
            return state;
    }
};

export default dashboard;