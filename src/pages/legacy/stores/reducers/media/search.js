import {
    MEDIA_SEARCH_LOAD_FILTERS,
    MEDIA_SEARCH_SELECT_FILTERS,
    MEDIA_SEARCH_ADD_KEYWORD,
    MEDIA_SEARCH_LOAD_SEARCH_RESULTS,
} from '../../../constants/action-types';

const initialState = {
    filters: {
        loadedFilters: [],
        selectedFilters: {},
        keywordFilters: [],
    },
    searchResults: [],
};

const media = (state = initialState, action) => {
    switch (action.type) {
        case MEDIA_SEARCH_LOAD_FILTERS:
            return {...state, filters: {...state.filters, loadedFilters: action.payload}};

        // NEED TO REVISIT THIS
        case MEDIA_SEARCH_SELECT_FILTERS:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    selectedFilters: {
                        ...state.filters.selectedFilters,
                        [action.payload.filterName]: action.payload.filterValues,
                    },
                },
            };

        case MEDIA_SEARCH_ADD_KEYWORD:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    keywordFilters: [...action.payload],
                },
            };

        case MEDIA_SEARCH_LOAD_SEARCH_RESULTS:
            return {...state, searchResults: action.payload};

        default:
            return state;
    }
};

export default media;
