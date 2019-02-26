import {
    METADATA_TITLE_SEARCH_FORM__UPDATE_TEXT_SEARCH,
    METADATA_TITLE_RESULT_PAGE__UPDATE,
    METADATA_TITLE_RESULT_PAGE__LOADING,
    METADATA_TITLE_LOAD_SESSION,
    TERRITORY_METADATA_ADD
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
        columns: ['title', 'contentType', 'productionYear'],
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
        case METADATA_TITLE_RESULT_PAGE__LOADING:
            return { ...state, titleTabPageLoading: action.payload };
        case TERRITORY_METADATA_ADD:
            return { ...state, territories: [...state.territories, action.payload] };
        default:
            return state;
    }
};

export default metadata;