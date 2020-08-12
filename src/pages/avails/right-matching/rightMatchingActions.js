import * as actionTypes from './rightMatchingActionTypes';

export const createRightMatchingColumnDefs = payload => ({
    type: actionTypes.CREATE_RIGHT_MATCHING_COLUMN_DEFS,
    payload,
});

export const fetchRightMatchingFieldSearchCriteria = payload => ({
    type: actionTypes.FETCH_AND_STORE_RIGHT_MATCHING_FIELD_SEARCH_CRITERIA,
    payload,
});

export const fetchAndStoreFocusedRight = payload => ({
    type: actionTypes.FETCH_AND_STORE_FOCUSED_RIGHT,
    payload,
});

export const storePendingRight = payload => ({
    type: actionTypes.STORE_PENDING_RIGHT,
    payload,
});

export const fetchMatchedRights = ids => ({
    type: actionTypes.FETCH_MATCHED_RIGHT,
    payload: ids,
});

export const fetchCombinedRight = (rightIds, mapping) => ({
    type: actionTypes.FETCH_COMBINED_RIGHT,
    payload: {rightIds, mapping},
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

export const storeMatchedRightIds = payload => ({
    type: actionTypes.STORE_MATCHED_RIGHT_IDS,
    payload,
});

export const setFoundFocusRightInRightsRepository = payload => ({
    type: actionTypes.FOUND_FOCUS_RIGHT_IN_RIGHTS_REPOSITORY,
    payload,
});
