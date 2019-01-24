import {
    METADATA_TITLE_SEARCH_FORM__UPDATE_TEXT_SEARCH,
    METADATA_TITLE_SEARCH_FORM__SET_SEARCH_CRITERIA,
    METADATA_TITLE_SEARCH_FORM__USE_ADVANCED_SEARCH,
    METADATA_TITLE_RESULT_PAGE__UPDATE,
    METADATA_TITLE_RESULT_PAGE__SORT,
    METADATA_TITLE_RESULT_PAGE__SELECT_ROW,
    METADATA_TITLE_RESULT_PAGE__LOADING,
    METADATA_TITLE_SEARCH_FORM__UPDATE_ADVANCED_SEARCH_CRITERIA,
    METADATA_TITLE_LOAD_SESSION,
    METADATA_TITLE_SEARCH_FORM__SHOW_ADVANCED_SEARCH,
    METADATA_TITLE_SEARCH_FORM__SHOW_SEARCH_RESULTS,
    METADATA_TITLE_SEARCH_FORM__SET_ADVANCED_SEARCH_CRITERIA,
} from '../constants/action-types';
import {saveDashboardState} from '../../../stores';

const initialState = {
    titleTabPage: {
        pages: 0,
        titles: [],
        pageSize: 0,
        total: 0
    },
    titleTabPageLoading: false,
    freeTextSearch: {
        text: ''
    },
    session: {
        titleTabPageSelection: {
            selected: [],
            selectAll: false
        },
        useAdvancedSearch: false,
        showAdvancedSearch: false,
        showSearchResults: false,
        advancedSearchCriteria: {},
        titleTabPageSort: [],
        searchCriteria: {},
        reportName: '',
        columns: ['title', 'studio', 'territory', 'genres', 'vodStart', 'vodEnd'],
        columnsSize: {}
    }
};



const metadata = (state = initialState, action) => {
    switch (action.type) {
        case METADATA_TITLE_LOAD_SESSION:
            return { ...state, session: {...state.session, ...action.payload}};
        case METADATA_TITLE_RESULT_PAGE__UPDATE:
            return {...state, titleTabPage: {...state.titleTabPage, ...action.payload}};
        case METADATA_TITLE_SEARCH_FORM__UPDATE_TEXT_SEARCH:
            return { ...state, freeTextSearch: {...state.freeTextSearch, ...action.payload}};
        case METADATA_TITLE_RESULT_PAGE__LOADING:
            return {...state, titleTabPageLoading: action.payload};
//  ------------   SESSION Actions   ----------------------------
        /*case SET_REPORT_NAME:
            saveDashboardState();
            return {...state, session: {...state.session, reportName: action.payload}};*/
        case METADATA_TITLE_SEARCH_FORM__SET_ADVANCED_SEARCH_CRITERIA:
             saveDashboardState();
            return { ...state, session: {...state.session, advancedSearchCriteria: action.payload}};
        case METADATA_TITLE_SEARCH_FORM__UPDATE_ADVANCED_SEARCH_CRITERIA:
             saveDashboardState();
            return { ...state, session: {...state.session, advancedSearchCriteria: {...state.session.advancedSearchCriteria, ...action.payload}}};
        case METADATA_TITLE_SEARCH_FORM__SET_SEARCH_CRITERIA:
             saveDashboardState();
            return { ...state, session: {...state.session, searchCriteria: {...action.payload}}};
        case METADATA_TITLE_SEARCH_FORM__USE_ADVANCED_SEARCH:
             saveDashboardState();
            return { ...state, session: {...state.session, useAdvancedSearch: action.payload}};
        case METADATA_TITLE_SEARCH_FORM__SHOW_ADVANCED_SEARCH:
             saveDashboardState();
            return { ...state, session: {...state.session, showAdvancedSearch: action.payload}};
        case METADATA_TITLE_SEARCH_FORM__SHOW_SEARCH_RESULTS:
             saveDashboardState();
            return { ...state, session: {...state.session, showSearchResults: action.payload}};
        case METADATA_TITLE_RESULT_PAGE__SORT:
             saveDashboardState();
            return { ...state, session: {...state.session, titleTabPageSort: action.payload}};
        /*case METADATA_TITLE_RESULT_PAGE__UPDATE_COLUMNS_ORDER:
             saveDashboardState();
            return { ...state, session: {...state.session, columns: action.payload}};*/
        case METADATA_TITLE_RESULT_PAGE__SELECT_ROW:
            saveDashboardState();
            return { ...state, session: {...state.session, titleTabPageSelection: action.payload}};
        default:
            return state;
    }
};

export default metadata;