import * as actionTypes from './settingsActionTypes';

const initialState = {
    configEndpoints: [],
};

const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.STORE_CONFIG_API_ENDPOINTS:
            return {
                ...state,
                configEndpoints: action.payload && action.payload.endpoints,
            };
        default:
            return state;
    }
};

export default settingsReducer;
