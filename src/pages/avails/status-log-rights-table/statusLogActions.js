import * as actionTypes from './statusLogActionTypes';

export const saveStatusDataAction = payload => ({
    type: actionTypes.SAVE_STATUS_DATA,
    payload,
});

export const removeStatusDataAction = payload => ({
    type: REMOVE_STATUS_DATA,
    payload,
});

export const storeResyncRights = payload => ({
    type: actionTypes.STORE_RESYNC_RIGHTS,
    payload,
});
