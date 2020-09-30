import * as actionTypes from './authActionTypes';

const initialState = {
    refreshToken: null,
    token: null,
    userAccount: {},
    isAuthenticated: false,
};

const authReducer = (state = initialState, action) => {
    const {type, payload = {}} = action || {};
    switch (type) {
        case actionTypes.REFRESH_TOKEN:
            return {
                ...state,
                refreshToken: payload.refreshToken,
                token: payload.token,
                userAccount: payload.profileInfo,
            };
        case actionTypes.STORE_USER_ACCOUNT:
        case actionTypes.STORE_TOKENS:
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
