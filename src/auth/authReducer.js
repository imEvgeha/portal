import * as actionTypes from './authActionTypes';
import {setAccessToken, setRefreshToken, removeAccessToken, removeRefreshToken} from './authService';

const initialState = {
    refreshToken: null, 
    accessToken: null,
    userAccount: null,
    isAuthenticated: false,
};

const authReducer = (state = initialState, action) => {
    const {type, payload = {}} = action || {};
    switch (type) {
        case actionTypes.REFRESH_TOKEN:
            // TODO: temporary solution
            if (payload.refreshToken) {
                setRefreshToken(payload.refreshToken);
                setAccessToken(payload.accessToken);
            }
            return {
                ...state,
                refreshToken: payload.refreshToken,
                accessToken: payload.accessToken,
                userAccount: payload.profileInfo,
            };
        case actionTypes.LOGOUT:
            if (payload.keycloak) {
                removeAccessToken();
                removeRefreshToken();
                payload.keycloak.logout();
            }
            return {
                ...state,
                refreshToken: null,
                accessToken: null,
                profileInfo: null,
            };
        case actionTypes.STORE_USER_ACCOUNT:
            // TODO: temporary solution
            if (payload.refreshToken) {
                setRefreshToken(payload.refreshToken);
                setAccessToken(payload.accessToken);
            }
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
            };
        default:
            return state;
    }
};

export default authReducer;

