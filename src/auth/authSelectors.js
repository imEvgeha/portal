import {createSelector} from 'reselect';
import {get} from 'lodash';

const getAuth = state => state.auth || {};

const getAccessToken = (state) => {
    const auth = getAuth(state);
    return auth.token;
};

const getRefreshToken = (state) => {
    const auth = getAuth(state);
    return auth.refreshToken;
};

const getAuthStatus = (state) => {
    const auth = getAuth(state);
    return auth.isAuthenticated;
};

export const createAuthSelector = () => createSelector(
    getAccessToken, getRefreshToken, getAuthStatus,
    (token, refreshToken, isAuthenticated) => {
        return {
            token, 
            refreshToken,
            isAuthenticated,
        };
    }
);
