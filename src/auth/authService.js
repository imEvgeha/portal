import config from 'react-global-configuration';
import jwtDecode from 'jwt-decode';
import Http from '../util/Http';
import {encodedSerialize} from '../util/Common';

const ACCESS_TOKEN = 'token';
const REFRESH_TOKEN = 'refreshToken';

export const getAccessToken = () => JSON.parse(localStorage.getItem(ACCESS_TOKEN));

const options = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
};

const http = Http.create(options);

const pathname = 'protocol/openid-connect/token';

export const getValidAccessToken = () => {
    const token = JSON.parse(localStorage.getItem(ACCESS_TOKEN));
    if (!token) {
        return false;
    }
    const decodedToken = jwtDecode(token);
    if (!isTokenExpired(decodedToken)) {
        return token;
    }
};

export const isTokenExpired = token => {
    if (!token) {
        return true;
    } else if (token.exp < (new Date().getTime() / 1000)) {
        return true;
    }
    return false;
};

export const setAccessToken =  token => localStorage.setItem(ACCESS_TOKEN, JSON.stringify(token));

export const removeAccessToken = () => localStorage.removeItem(ACCESS_TOKEN);

export const getRefreshToken = () => JSON.parse(localStorage.getItem(REFRESH_TOKEN));

export const getValidRefreshToken = () => {
    const token = JSON.parse(localStorage.getItem(REFRESH_TOKEN));
    if (!token) {
        return false;
    }
    const decodedToken = jwtDecode(token);
    if (!isTokenExpired(decodedToken)) {
        return decodedToken;
    }
};

export const setRefreshToken = refreshToken => localStorage.setItem(REFRESH_TOKEN, JSON.stringify(refreshToken));

export const removeRefreshToken = () => localStorage.removeItem(REFRESH_TOKEN);

export const refreshTokenService = (data) => http.post(`${config.get('keycloak.url')}/realms/${config.get('keycloak.realm')}/${pathname}`, encodedSerialize(data));

