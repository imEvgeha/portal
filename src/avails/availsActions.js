import actionTypes from './availsActionTypes';

export const fetchIngests = payload => ({
    type: actionTypes.FETCH_INGESTS,
    payload,
});

export const fetchNextPage = () => ({
    type: actionTypes.FETCH_NEXT_PAGE,
});