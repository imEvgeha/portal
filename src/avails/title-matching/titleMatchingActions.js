import * as actionTypes from './titleMatchingActionTypes';

export const fetchFocusedRight = (id) => ({
    type: actionTypes.FETCH_FOCUSED_RIGHT,
    payload: id,
});

export const createColumnDefs = () => ({
    type: actionTypes.CREATE_COLUMN_DEFS,
});

export const selectTitles = (matchList, duplicateList, historyPush) => ({
    type: actionTypes.SELECT_TITLES,
    payload : { matchList, duplicateList, historyPush },
});