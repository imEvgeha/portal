import * as actionTypes from './titleMatchingActionTypes';

export const fetchFocusedRight = (id) => ({
    type: actionTypes.FETCH_FOCUSED_RIGHT,
    payload: id,
});