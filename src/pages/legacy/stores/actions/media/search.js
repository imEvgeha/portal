import {
    MEDIA_SEARCH_LOAD_FILTERS,
    MEDIA_SEARCH_SELECT_FILTERS,
    MEDIA_SEARCH_ADD_KEYWORD,
    MEDIA_SEARCH_LOAD_SEARCH_RESULTS,
} from '../../../constants/action-types';

export const loadFilterResults = filters => {
    return {type: MEDIA_SEARCH_LOAD_FILTERS, payload: filters};
};

export const selectFilterResults = filter => {
    return {type: MEDIA_SEARCH_SELECT_FILTERS, payload: filter};
};

export const addKeywordFilter = keywordFilter => {
    return {type: MEDIA_SEARCH_ADD_KEYWORD, payload: keywordFilter};
};

export const loadSearchResults = searchResults => {
    return {type: MEDIA_SEARCH_LOAD_SEARCH_RESULTS, payload: searchResults};
};
