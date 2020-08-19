import * as actionTypes from './availActionTypes';

export const fetchAvailMapping = payload => ({
    type: actionTypes.FETCH_AVAIL_MAPPING,
    payload,
});

export const fetchAvailConfiguration = payload => ({
    type: actionTypes.FETCH_AVAIL_CONFIGURATION,
    payload,
});

export const handleMatchingRightsAction = payload => ({
    type: actionTypes.HANDLE_MATCHING_RIGHTS,
    payload,
});
