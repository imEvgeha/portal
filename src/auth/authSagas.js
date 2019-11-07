import {call, put, all, select, takeEvery, delay} from 'redux-saga/effects';
import config from 'react-global-configuration';
import jwtDecode from 'jwt-decode';
import * as actionTypes from './authActionTypes';
import {
    refreshTokenService, 
    removeAccessToken, 
    removeRefreshToken, 
    setAccessToken, 
    getAccessToken,
    setRefreshToken,
    getRefreshToken,
    getValidRefreshToken,
} from './authService';

const BEFORE_EXPIRATION = 60;
const GRANT_TYPE = 'refresh_token';

export function* refreshTokenFlow(requestMethod) {
    try {
        const validRefreshToken = getValidRefreshToken();
        if (!validRefreshToken) {
            throw {};
        }
        const expiresIn = Math.floor(validRefreshToken.exp - (new Date() / 1000));
        const delayInMilliseconds = (expiresIn - BEFORE_EXPIRATION) * 1000;
        yield delay(20000);
        yield put({
            type: actionTypes.REFRESH_TOKEN_REQUEST, 
            payload: {},
        });
        const bodyData = {
            'grant_type': GRANT_TYPE,
            'client_id': config.get('keycloak.clientId'),
            'refresh_token': getRefreshToken(),
        };
        const {data} = yield call(requestMethod, bodyData);
        const {access_token, refresh_token} = data || {};
        const payload = {
            accessToken: access_token,
            refreshToken: refresh_token,
            profileInfo: getProfileInfo(access_token),
        };
        yield put({
            type: actionTypes.REFRESH_TOKEN_SUCCESS, 
            payload,
        });
    } catch (error) {
        yield put({
            type: actionTypes.REFRESH_TOKEN_ERROR, 
            payload: error,
        });
        yield put({
            type: actionTypes.LOGOUT,
            payload: {}
        });
    }
}

function getProfileInfo(token) {
    const {
        name, 
        prefered_username, 
        given_name, 
        family_name, 
        email,
        email_verified,
    } = jwtDecode(token);
    return {
        name,
        prefered_username,
        given_name,
        family_name,
        email,
        email_verified,
    };
}

export function* storeAuthCredentials({payload}) {
    const {token, refreshToken, profileInfo} = payload || {};
    try {
        yield put({
            type: actionTypes.STORE_AUTH_CREDENTIALS_REQUEST,
            payload: {},
        });
        yield all([
            call(setAccessToken, token || getAccessToken()),
            call(setRefreshToken, refreshToken || getRefreshToken()),
        ]);
        const response = {
            accessToken: getAccessToken(),
            refreshToken: getRefreshToken(),
            profileInfo: profileInfo || getProfileInfo(getAccessToken()),
        };
        yield put({
            type: actionTypes.STORE_AUTH_CREDENTIALS_SUCCESS,
            payload: response,
        });
    } catch (error) {
        yield put({
            type: actionTypes.STORE_AUTH_CREDENTIALS_ERROR,
            payload: {error},
        });
        yield call(logout);
    }
}

export function* logout() {
    try {
        yield put({
            type: actionTypes.LOGOUT_REQUEST,
            payload: {},
        });
        yield all([
            call(removeAccessToken),
            call(removeRefreshToken),
        ]);
        yield put({
            type: actionTypes.LOGOUT_SUCCESS,
            payload: {},
        });
    } catch (error) {
        yield put({
            type: actionTypes.LOGOUT_ERROR,
            payload: {error},
        });
    }
}

export function* authWatcher() {
    yield all([
        takeEvery(actionTypes.REFRESH_TOKEN, refreshTokenFlow, refreshTokenService),
        takeEvery(actionTypes.LOGOUT, logout),
        takeEvery(actionTypes.STORE_AUTH_CREDENTIALS, storeAuthCredentials),
    ]);
}

