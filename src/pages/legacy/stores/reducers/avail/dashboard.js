import {
    DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH,
    DASHBOARD_SEARCH_FORM__SET_SEARCH_CRITERIA,
    DASHBOARD_RESULT_PAGE__UPDATE,
    DASHBOARD_RESULT_PAGE__SORT,
    DASHBOARD_RESULT_PAGE__LOADING,
    DASHBOARD_SEARCH_FORM__UPDATE_ADVANCED_SEARCH_CRITERIA,
    DASHBOARD_RESULT_PAGE__UPDATE_COLUMNS_ORDER,
    DASHBOARD_RESULT_PAGE__SELECT_ROW,
    SET_REPORT_NAME,
    LOAD_DASHBOARD_SESSION,
    DASHBOARD_SEARCH_FORM__SHOW_SEARCH_RESULTS,
    DASHBOARD_SEARCH_FORM__SHOW_ADVANCED_SEARCH,
    DASHBOARD_SEARCH_FORM__SET_ADVANCED_SEARCH_CRITERIA,
    AVAIL__RESULTS_PAGE__SHOW_SELECTED,
    AVAIL__SET_HISTORY_CACHE,
    AVAIL__SET_BULK_EXPORT,
} from '../../../constants/action-types';
import {saveDashboardState} from '../../index';

const initialState = {
    availTabPage: {
        pages: 0,
        avails: [],
        pageSize: 0,
        total: 0,
    },
    bulkExportAvailable: false,
    showSelectedAvails: false,
    availTabPageLoading: false,
    session: {
        historyCache: {},
        freeTextSearch: {
            text: '',
        },
        availTabPageSelection: {
            selected: [],
            selectNone: true,
            selectAll: false,
        },
        useAdvancedSearch: false,
        showAdvancedSearch: false,
        showSearchResults: false,
        advancedSearchCriteria: {},
        availTabPageSort: [],
        searchCriteria: {},
        reportName: '',
        columns: null,
        columnsSize: {},
    },
};

const dashboard = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_DASHBOARD_SESSION:
            return {...state, session: {...state.session, ...action.payload}};
        case DASHBOARD_RESULT_PAGE__UPDATE:
            return {...state, availTabPage: {...state.availTabPage, ...action.payload}};
        case DASHBOARD_RESULT_PAGE__LOADING:
            return {...state, availTabPageLoading: action.payload};
        case AVAIL__RESULTS_PAGE__SHOW_SELECTED:
            return {...state, showSelectedAvails: action.payload};
        case AVAIL__SET_BULK_EXPORT:
            return {...state, bulkExportAvailable: action.payload};
        //  ------------   SESSION Actions   ----------------------------
        case AVAIL__SET_HISTORY_CACHE:
            saveDashboardState();
            return {...state, session: {...state.session, historyCache: action.payload}};
        case DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH:
            saveDashboardState();
            return {...state, session: {...state.session, freeTextSearch: action.payload}};
        case SET_REPORT_NAME:
            saveDashboardState();
            return {...state, session: {...state.session, reportName: action.payload}};
        case DASHBOARD_SEARCH_FORM__SET_ADVANCED_SEARCH_CRITERIA:
            saveDashboardState();
            return {...state, session: {...state.session, advancedSearchCriteria: action.payload}};
        case DASHBOARD_SEARCH_FORM__UPDATE_ADVANCED_SEARCH_CRITERIA:
            saveDashboardState();
            return {
                ...state,
                session: {
                    ...state.session,
                    advancedSearchCriteria: {...state.session.advancedSearchCriteria, ...action.payload},
                },
            };
        case DASHBOARD_SEARCH_FORM__SET_SEARCH_CRITERIA:
            saveDashboardState();
            return {...state, session: {...state.session, searchCriteria: {...action.payload}}};
        case DASHBOARD_SEARCH_FORM__SHOW_ADVANCED_SEARCH:
            saveDashboardState();
            return {...state, session: {...state.session, showAdvancedSearch: action.payload}};
        case DASHBOARD_SEARCH_FORM__SHOW_SEARCH_RESULTS:
            saveDashboardState();
            return {...state, session: {...state.session, showSearchResults: action.payload}};
        case DASHBOARD_RESULT_PAGE__SORT:
            saveDashboardState();
            return {...state, session: {...state.session, availTabPageSort: action.payload}};
        case DASHBOARD_RESULT_PAGE__UPDATE_COLUMNS_ORDER:
            saveDashboardState();
            return {...state, session: {...state.session, columns: action.payload || initialState.session.columns}};
        case DASHBOARD_RESULT_PAGE__SELECT_ROW:
            saveDashboardState();
            return {...state, session: {...state.session, availTabPageSelection: action.payload}};
        default:
            return state;
    }
};

export default dashboard;
