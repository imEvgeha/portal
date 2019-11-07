import * as actionTypes from './authActionTypes';

export const storeAuthCredentials = (payload) => ({
    type: actionTypes.STORE_AUTH_CREDENTIALS,
    payload,
});

export const authRefreshToken = (payload) => ({
    type: actionTypes.REFRESH_TOKEN,
    payload,
});

export const logout = (payload) => ({
    type: actionTypes.LOGOUT,
    payload,
});

