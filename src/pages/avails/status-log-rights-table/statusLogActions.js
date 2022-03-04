import * as actionTypes from './statusLogActionTypes';

export const saveStatusDataAction = payload => ({
    type: actionTypes.SAVE_STATUS_DATA,
    payload,
});

export const removeStatusDataAction = payload => ({
    type: actionTypes.REMOVE_STATUS_DATA,
    payload,
});

export const storeResyncRights = payload => ({
    type: actionTypes.STORE_RESYNC_RIGHTS,
    payload,
});

export const postReSyncRights = payload => ({
    type: actionTypes.POST_RESYNC_RIGHTS,
    payload,
});

export const storeSelectedResyncRights = payload => ({
    type: actionTypes.STORE_SELECTED_RESYNC_RIGHTS,
    payload,
});
