import {call, put, all, select, takeEvery, delay} from 'redux-saga/effects';
import config from 'react-global-configuration';
import jwtDecode from 'jwt-decode';
import {push} from 'connected-react-router';
import * as actionTypes from './authActionTypes';
import isEmpty from 'lodash.isempty';
import {
    refreshTokenService, 
    removeAccessToken, 
    removeRefreshToken, 
    setAccessToken, 
    getAccessToken,
    setRefreshToken,
    getRefreshToken,
    getValidRefreshToken,
    logoutUser,
} from './authService';
import {encodedSerialize} from '../util/Common';

const BEFORE_EXPIRATION = 60;
const GRANT_TYPE = 'refresh_token';

export function* refreshTokenFlow({payload}) {
    const {keycloak} = payload || {};
    try {
        const validRefreshToken = getValidRefreshToken();
        if (!validRefreshToken) {
            throw {error: 'Not valid token'};
        }
        const expiresIn = Math.floor(validRefreshToken.exp - (new Date() / 1000));
        const delayInMilliseconds = (expiresIn - BEFORE_EXPIRATION) * 1000;
        yield delay(delayInMilliseconds);
        yield put({
            type: actionTypes.REFRESH_TOKEN_REQUEST, 
            payload: {},
        });
        const bodyData = {
            'grant_type': GRANT_TYPE,
            'client_id': config.get('keycloak.clientId'),
            'refresh_token': getRefreshToken(),
        };
        const {data} = yield call(refreshTokenService, bodyData);
        const {access_token, refresh_token} = data || {};
        const payload = {
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    userAccount: getProfileInfo(access_token),
                };
        yield put({
                    type: actionTypes.REFRESH_TOKEN_SUCCESS, 
                    payload,
                });
        yield put({
                    type: actionTypes.REFRESH_TOKEN,
                    payload: {},
                });
    } catch (error) {
            yield put({
                        type: actionTypes.REFRESH_TOKEN_ERROR, 
                        payload: error,
                    });
            yield put({
                        type: actionTypes.LOGOUT,
                        payload: {keycloak}
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

export function* logout({payload}) {
    const {keycloak} = payload;
    try {
        yield put({
            type: actionTypes.LOGOUT_REQUEST,
            payload: {},
        });
        yield all([
            call(removeAccessToken),
            call(removeRefreshToken),
            call(keycloak.logout)
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
        // takeEvery(actionTypes.REFRESH_TOKEN, refreshTokenFlow),
        // takeEvery(actionTypes.LOGOUT, logout),
    ]);
}
