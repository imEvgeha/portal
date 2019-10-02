import * as actionTypes from './rightMatchingActionTypes';

export const createRightMatchingColumnDefs = (payload) => ({
    type: actionTypes.CREATE_RIGHT_MATCHING_COLUMN_DEFS,
    payload,
});

export const fetchFocusedRight = (id) => ({
    type: actionTypes.FETCH_FOCUSED_RIGHT,
    payload: id,
});

