import actionTypes from './availsActionTypes';

export const fetchAvails = payload => ({
    type: actionTypes.FETCH_AVAILS,
    payload,
});

export const fetchNextPage = () => ({
    type: actionTypes.FETCH_NEXT_PAGE,
});