import {get} from 'lodash';
import {createSelector} from 'reselect';

const getAuth = state => state.auth || {};

const getAccessToken = state => {
    const auth = getAuth(state);
    return auth.token;
};

const getRefreshToken = state => {
    const auth = getAuth(state);
    return auth.refreshToken;
};

const getAuthStatus = state => {
    const auth = getAuth(state);
    return auth.isAuthenticated;
};

export const createAuthSelector = () =>
    createSelector(getAccessToken, getRefreshToken, getAuthStatus, (token, refreshToken, isAuthenticated) => {
        return {
            token,
            refreshToken,
            isAuthenticated,
        };
    });

export const getUsername = createSelector(getAuth, auth => get(auth, 'userAccount.username', ''));
