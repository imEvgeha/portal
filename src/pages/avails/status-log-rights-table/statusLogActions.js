import * as actionTypes from './statusLogActionTypes';

export const saveStatusDataAction = payload => ({
    type: actionTypes.SAVE_STATUS_DATA,
    payload,
});

export const removeStatusDataAction = payload => ({
    type: actionTypes.REMOVE_STATUS_DATA,
    payload,
});

export const postReSyncRights = payload => ({
    type: actionTypes.POST_RESYNC_RIGHTS,
    payload,
});
