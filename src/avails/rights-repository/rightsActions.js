import * as actionTypes from './rightsActionTypes';

export const updateRights = payload => ({
    type: actionTypes.UPDATE_RIGHTS,
    payload,
});

export const setSelectedRights = payload => ({
    type: actionTypes.SET_SELECTED_RIGHTS,
    payload,
});
