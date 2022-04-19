import * as actionTypes from './authActionTypes';

export const logout = payload => ({
    type: actionTypes.LOGOUT,
    payload,
});

export const injectUser = payload => ({
    type: actionTypes.STORE_USER_ACCOUNT,
    payload,
});

export const setSelectedTenantInfo = payload => ({
    type: actionTypes.SET_SELECTED_TENANT_INFO,
    payload,
});
