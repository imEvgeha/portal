import * as actionTypes from './metadataActionTypes';

export const fetchTitle = payload => ({
    type: actionTypes.FETCH_AND_STORE_TITLE,
    payload,
});

export const storeTitle = title => ({
    type: actionTypes.STORE_TITLE,
    payload: {[title.id]: title}
});
