import * as actionTypes from './rightMatchingActionTypes';

export const createRightMatchingColumnDefs = payload => ({
    type: actionTypes.CREATE_RIGHT_MATCHING_COLUMN_DEFS,
    payload,
});

export const fetchAndStoreFocusedRight = payload => ({
    type: actionTypes.FETCH_AND_STORE_FOCUSED_RIGHT,
    payload,
});

export const fetchCombinedRight = payload => ({
    type: actionTypes.FETCH_COMBINED_RIGHT,
    payload,
});

export const storeRightMatchDataWithIds = payload => ({
    type: actionTypes.STORE_RIGHT_MATCH_DATA_WITH_IDS,
    payload,
});

export const cleanStoredRightMatchDataWithIds = () => ({
    type: actionTypes.CLEAN_STORED_RIGHT_MATCH_DATA_WITH_IDS,
});

export const fetchRightMatchDataUntilFindId = payload => ({
    type: actionTypes.FETCH_RIGHT_MATCH_DATA_UNTIL_FIND_ID,
    payload,
});

export const saveCombinedRight = payload => ({
    type: actionTypes.SAVE_COMBINED_RIGHT,
    payload,
});

export const createNewRight = payload => ({
    type: actionTypes.CREATE_NEW_RIGHT,
    payload,
});

export const storeMatchedRights = payload => ({
    type: actionTypes.STORE_MATCHED_RIGHTS,
    payload,
});
