import * as actionTypes from './authActionTypes';

const initialState = {
    refreshToken: null, 
    accessToken: null,
    profileInfo: {},
};

const authReducer = (state = initialState, action) => {
    const {type, payload = {}} = action || {};
    switch (type) {
        case actionTypes.REFRESH_TOKEN_SUCCESS:
            return {
                ...state,
                refreshToken: payload.refreshToken,
                accessToken: payload.accessToken,
                profileInfo: payload.profileInfo,
            };
        case actionTypes.LOGOUT_SUCCESS:
        case actionTypes.LOGOUT_ERROR:
            return {
                ...state,
                refreshToken: null,
                accessToken: null,
                profileInfo: {},
            };
        case actionTypes.STORE_AUTH_CREDENTIALS_SUCCESS:
            return {
                ...state,
                refreshToken: payload.refreshToken,
                accessToken: payload.accessToken,
                profileInfo: payload.profileInfo,
            };
        default:
            return state;
    }
};

export default authReducer;

