import * as actionTypes from './rightMatchingActionTypes';

export const createRightMatchingColumnDefs = (payload) => ({
    type: actionTypes.CREATE_RIGHT_MATCHING_COLUMN_DEFS,
    payload,
});

export const fetchRightMatchingProvider = (payload) => ({
    type: actionTypes.FETCH_RIGHT_MATCHING_PROVIDER,
    payload,
});

export const fetchRightMatchingFieldSearchCriteria = (payload) => ({
    type: actionTypes.FETCH_AND_STORE_RIGHT_MATCHING_FIELD_SEARCH_CRITERIA,
    payload,
});

export const fetchAndStoreFocusedRight = (payload) => ({
    type: actionTypes.FETCH_AND_STORE_FOCUSED_RIGHT,
    payload,
});

