import {
    DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH,
    DASHBOARD_SEARCH_FORM__SET_SEARCH_CRITERIA,
    DASHBOARD_RESULT_PAGE__SORT,
    DASHBOARD_RESULT_PAGE__LOADING,
    DASHBOARD_RESULT_PAGE__UPDATE_COLUMNS_ORDER,
    SET_REPORT_NAME,
    DASHBOARD_SEARCH_FORM__SET_ADVANCED_SEARCH_CRITERIA,
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
        case DASHBOARD_RESULT_PAGE__LOADING:
            return {...state, availTabPageLoading: action.payload};
        case AVAIL__SET_BULK_EXPORT:
            return {...state, bulkExportAvailable: action.payload};
        //  ------------   SESSION Actions   ----------------------------
        case DASHBOARD_SEARCH_FORM__UPDATE_TEXT_SEARCH:
            saveDashboardState();
            return {...state, session: {...state.session, freeTextSearch: action.payload}};
        case SET_REPORT_NAME:
            saveDashboardState();
            return {...state, session: {...state.session, reportName: action.payload}};
        case DASHBOARD_SEARCH_FORM__SET_ADVANCED_SEARCH_CRITERIA:
            saveDashboardState();
            return {...state, session: {...state.session, advancedSearchCriteria: action.payload}};
        case DASHBOARD_SEARCH_FORM__SET_SEARCH_CRITERIA:
            saveDashboardState();
            return {...state, session: {...state.session, searchCriteria: {...action.payload}}};
        case DASHBOARD_RESULT_PAGE__SORT:
            saveDashboardState();
            return {...state, session: {...state.session, availTabPageSort: action.payload}};
        case DASHBOARD_RESULT_PAGE__UPDATE_COLUMNS_ORDER:
            saveDashboardState();
            return {...state, session: {...state.session, columns: action.payload || initialState.session.columns}};
        default:
            return state;
    }
};

export default dashboard;
