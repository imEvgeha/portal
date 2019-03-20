import {
    METADATA_TITLE_SEARCH_FORM__UPDATE_TEXT_SEARCH,
    METADATA_TITLE_RESULT_PAGE__UPDATE,
    METADATA_TITLE_RESULT_PAGE__LOADING,
    METADATA_TITLE_LOAD_SESSION,
    TERRITORY_METADATA_ADD,
    TERRITORY_METADATA_LOAD_BY_ID,
    METADATA_TITLE_SEARCH_FORM__SET_SEARCH_CRITERIA,
    METADATA_TITLE_SEARCH_FORM__SHOW_SEARCH_RESULTS,
    METADATA_TITLE_RESULT_PAGE__SORT,
    METADATA_TITLE_RESULT_PAGE__UPDATE_COLUMNS_ORDER,
    METADATA_TITLE_RESULT_PAGE__SELECT_ROW
} from '../../../constants/action-types';

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
        columns: ['title', 'contentType', 'releaseYear'],
        columnsSize: {}
    },
    territories: [],
    editedTerritories: []
};



const metadata = (state = initialState, action) => {
    switch (action.type) {
        case METADATA_TITLE_LOAD_SESSION:
            return { ...state, session: { ...state.session, ...action.payload } };
        case METADATA_TITLE_RESULT_PAGE__UPDATE:
            return { ...state, titleTabPage: { ...state.titleTabPage, ...action.payload } };
        case METADATA_TITLE_SEARCH_FORM__UPDATE_TEXT_SEARCH:
            return { ...state, freeTextSearch: { ...state.freeTextSearch, ...action.payload } };
            case METADATA_TITLE_SEARCH_FORM__SET_SEARCH_CRITERIA:
            return { ...state, session: {...state.session, searchCriteria: {...action.payload}}};
        case METADATA_TITLE_RESULT_PAGE__LOADING:
            return { ...state, titleTabPageLoading: action.payload };
        case TERRITORY_METADATA_LOAD_BY_ID:
            return { ...state, territories: [...state.territories, action.payload] };
        case TERRITORY_METADATA_ADD:
            return { ...state, territories: [...state.territories, action.payload] };

            case METADATA_TITLE_SEARCH_FORM__SHOW_SEARCH_RESULTS:
            return { ...state, session: {...state.session, showSearchResults: action.payload}};
        case METADATA_TITLE_RESULT_PAGE__SORT:
            return { ...state, session: {...state.session, titleTabPageSort: action.payload}};
        case METADATA_TITLE_RESULT_PAGE__UPDATE_COLUMNS_ORDER:
            return { ...state, session: {...state.session, columns: action.payload || initialState.session.columns}};
        case METADATA_TITLE_RESULT_PAGE__SELECT_ROW:
            return { ...state, session: {...state.session, titleTabPageSelection: action.payload}};
        default:
            return state;
    }
};

export default metadata;