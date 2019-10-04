import * as actionTypes from './rightMatchingActionTypes';

export const createRightMatchingColumnDefs = (payload) => ({
    type: actionTypes.CREATE_RIGHT_MATCHING_COLUMN_DEFS,
    payload,
});

export const fetchFocusedRight = (id) => ({
    type: actionTypes.FETCH_FOCUSED_RIGHT,
    payload: id,
});

export const storeRightMatchDataWithIds = (payload) => ({
    type: actionTypes.STORE_RIGHT_MATCH_DATA_WITH_IDS,
    payload
});

export const cleanStoredRightMatchDataWithIds = () => ({
    type: actionTypes.CLEAN_STORED_RIGHT_MATCH_DATA_WITH_IDS
});

export const fetchRightMatchDataUntilFindId = (payload) => ({
    type: actionTypes.FETCH_RIGHT_MATCH_DATA_UNTIL_FIND_ID,
    payload
});