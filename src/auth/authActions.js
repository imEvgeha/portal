import * as actionTypes from './authActionTypes';

export const authRefreshToken = (payload) => ({
    type: actionTypes.REFRESH_TOKEN,
    payload,
});

export const logout = (payload) => ({
    type: actionTypes.LOGOUT,
    payload,
});

export const injectUser = payload => ({
    type: actionTypes.STORE_USER_ACCOUNT,
    payload,
});
