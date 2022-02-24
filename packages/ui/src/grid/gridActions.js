import {TOGGLE_REFRESH_GRID_DATA, EXPORT_GRID_RESPONSE_DATA} from './gridActionTypes';

export const toggleRefreshGridData = payload => ({
    type: TOGGLE_REFRESH_GRID_DATA,
    payload,
});

export const exportGridResponseData = payload => ({
    type: EXPORT_GRID_RESPONSE_DATA,
    payload,
});
