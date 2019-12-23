import actionTypes from './availsActionTypes';

export const updateFilters = payload => ({
    type: actionTypes.UPDATE_FILTERS,
    payload,
});