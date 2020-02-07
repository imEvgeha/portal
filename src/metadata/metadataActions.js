import * as actionTypes from './metadataActionTypes';

export const fetchTitle = payload => ({
    type: actionTypes.FETCH_AND_STORE_TITLE,
    payload,
});

export const fetchTitles = payload => ({
    type: actionTypes.FETCH_AND_STORE_TITLES,
    payload,
});

export const getTitleReconciliation = payload => ({
    type: actionTypes.GET_TITLE_RECONCILIATION,
    payload,
});

export const storeTitle = title => ({
    type: actionTypes.STORE_TITLE,
    payload: {[title.id]: title}
});
