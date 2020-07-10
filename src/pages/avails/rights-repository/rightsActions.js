import * as actionTypes from './rightsActionTypes';

export const setSelectedRights = payload => ({
    type: actionTypes.SET_SELECTED_RIGHTS,
    payload,
});

export const setRightsFilter = payload => ({
    type: actionTypes.SET_RIGHTS_FILTER,
    payload,
});
