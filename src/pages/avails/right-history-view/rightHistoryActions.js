import * as actionTypes from './rightHistoryActionTypes';

export const fetchRightsHistory = payload => ({
    type: actionTypes.FETCH_AND_STORE_RIGHT_HISTORY,
    payload,
});
