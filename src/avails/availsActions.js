import actionTypes from './availsActionTypes';

export const fetchAvails = payload => ({
    type: actionTypes.FETCH_AVAILS,
    payload,
});

export const fetchNextPage = () => ({
    type: actionTypes.FETCH_NEXT_PAGE,
});

export const filterRightsByStatus = payload => ({
    type: actionTypes.FILTER_RIGHTS_BY_STATUS,
    payload,
});