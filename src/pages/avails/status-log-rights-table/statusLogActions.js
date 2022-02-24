import {SAVE_STATUS_DATA, REMOVE_STATUS_DATA} from './statusLogActionTypes';

export const saveStatusDataAction = payload => ({
    type: SAVE_STATUS_DATA,
    payload,
});

export const removeStatusDataAction = payload => ({
    type: REMOVE_STATUS_DATA,
    payload,
});
