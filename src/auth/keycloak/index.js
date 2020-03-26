import Keycloak from 'keycloak-js';
import jwtDecode from 'jwt-decode';
import config from 'react-global-configuration';
import {getValidToken, getTokenDuration} from '../utils';

export let keycloak = {};

const KEYCLOAK_INIT_OPTIONS = {
    onLoad: 'login-required',
    promiseType: 'native',
};

const sleep = (fn, par) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(fn(par)), 3000);
    });
};

const setAsyncTimeout = (cb, timeout = 0) => new Promise(resolve => {
    setTimeout(() => {
        cb();
        resolve(cb());
    }, timeout);
});

const wait = async (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
};

export const refreshUserToken = async (DELAY = getTokenDuration(keycloak.tokenParsed)) => {
    console.log(DELAY);
    await wait(DELAY);
    try {
        const isRefreshed = await keycloak.updateToken(30);
        refreshUserToken();
        return isRefreshed;
    } catch (error) {
        throw error;
    }
};

export const initalizeKeycloak = async ({token, refreshToken, ...rest}) => {
    keycloak = new Keycloak(config.get('keycloak'));
    const options = {
        ...KEYCLOAK_INIT_OPTIONS,
        ...rest,
        token: getValidToken(token),
        refreshToken: getValidToken(refreshToken),
    };
    try {
        const isAuthenticated = await keycloak.init(options);
        if (!isAuthenticated) {
            window.location.reload();
        }
        return keycloak;
    } catch (error) {
        throw error;
    }

};
