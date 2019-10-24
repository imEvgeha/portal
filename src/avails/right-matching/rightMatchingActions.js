import * as actionTypes from './rightMatchingActionTypes';

export const createRightMatchingColumnDefs = (payload) => ({
    type: actionTypes.CREATE_RIGHT_MATCHING_COLUMN_DEFS,
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

export const fetchMatchedRight = (id) => ({
    type: actionTypes.FETCH_MATCHED_RIGHT,
    payload: id,
});

export const fetchCombinedRight = (focusedRightId, matchedRightId) => ({
    type: actionTypes.FETCH_COMBINED_RIGHT,
    payload: {focusedRightId, matchedRightId}
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

export const saveCombinedRight = (focusedRightId, matchedRightId, combinedRight) => ({
    type: actionTypes.SAVE_COMBINED_RIGHT,
    payload: {focusedRightId, matchedRightId, combinedRight}
});

export const setNewRightSuccessFlag = (payload) => ({
    type: actionTypes.SET_NEW_RIGHT_FLAG,
    payload
});

export const createNewRight = (payload) => ({
    type: actionTypes.CREATE_NEW_RIGHT,
    payload
});

export const setCombinedSavedFlag = (payload) => ({
    type: actionTypes.SET_COMBINED_RIGHT_SAVED_FLAG,
    payload
});
