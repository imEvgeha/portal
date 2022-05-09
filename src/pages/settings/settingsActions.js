import * as actionTypes from './settingsActionTypes';

export const fetchConfigApiEndpoints = payload => ({
    type: actionTypes.FETCH_CONFIG_API_ENDPOINTS,
    payload,
});
