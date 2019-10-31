import * as actionTypes from './titleMatchingActionTypes';

export const fetchFocusedRight = (id) => ({
    type: actionTypes.FETCH_FOCUSED_RIGHT,
    payload: id,
});

export const createColumnDefs = () => ({
    type: actionTypes.CREATE_COLUMN_DEFS,
});

export const mergeTitles = (matchList, duplicateList, toastApi) => ({
    type: actionTypes.MERGE_TITLES,
    payload : { matchList, duplicateList, toastApi },
});