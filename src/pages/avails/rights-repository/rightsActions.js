import * as actionTypes from './rightsActionTypes';

export const setSelectedRights = payload => ({
    type: actionTypes.SET_SELECTED_RIGHTS,
    payload,
});

export const setPreplanRights = payload => ({
    type: actionTypes.SET_PREPLAN_RIGHTS,
    payload,
});

export const setRightsFilter = payload => ({
    type: actionTypes.SET_RIGHTS_FILTER,
    payload,
});

export const getLinkedRights = payload => ({
    type: actionTypes.GET_LINKED_TO_ORIGINAL_RIGHTS,
    payload,
});

export const clearLinkedRights = () => ({
    type: actionTypes.CLEAR_LINKED_TO_ORIGINAL_RIGHTS,
});

export const getRight = payload => ({
    type: actionTypes.GET_RIGHT,
    payload,
});

export const updateRight = payload => ({
    type: actionTypes.UPDATE_RIGHT,
    payload,
});

export const storeAvailsUserDefinedGrid = payload => ({
    type: actionTypes.SET_AVAILS_USER_DEFINED_GRID,
    payload,
});

export const clearRight = () => ({
    type: actionTypes.CLEAR_RIGHT,
});

export const storeFromSelectedTable = payload => ({
    type: actionTypes.STORE_FROM_SELECTED_TABLE,
    payload,
});

export const setCurrentUserViewActionAvails = payload => ({
    type: actionTypes.SET_CURRENT_USER_VIEW_AVAILS,
    payload,
});

export const setColumnTableDefinition = payload => ({
    type: actionTypes.SET_AVAILS_GRID_STATE,
    payload,
});

export const setPrePlanColumnDef = payload => ({
    type: actionTypes.SET_PREPLAN_COLUMN_DEF,
    payload,
});

export const setSelectedRightsColDef = payload => ({
    type: actionTypes.SET_SELECTED_RIGHTS_COL_DEF,
    payload,
});
