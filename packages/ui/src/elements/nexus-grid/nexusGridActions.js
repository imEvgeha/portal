import * as actionTypes from './nexusGridActionTypes';

export const setGridColumnsSize = (gridId, columnsSize) => ({
    type: actionTypes.UPDATE_COLUMNS_SIZE,
    gridId,
    payload: columnsSize,
});

export const fetchAvailMapping = payload => ({
    type: actionTypes.FETCH_AVAIL_MAPPING,
    payload,
});
