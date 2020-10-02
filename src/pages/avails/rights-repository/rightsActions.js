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
