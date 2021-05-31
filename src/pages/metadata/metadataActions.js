import * as actionTypes from './metadataActionTypes';

export const fetchTitle = payload => ({
    type: actionTypes.FETCH_AND_STORE_TITLE,
    payload,
});

export const fetchTitles = payload => ({
    type: actionTypes.FETCH_AND_STORE_TITLES,
    payload,
});

export const getReconciliationTitles = payload => ({
    type: actionTypes.FETCH_AND_STORE_RECONCILIATION_TITLES,
    payload,
});

export const storeTitle = title => ({
    type: actionTypes.STORE_TITLE,
    payload: {[title.id]: title},
});

export const resetTitle = () => ({
    type: actionTypes.RESET_TITLE,
});

export const reconcileTitles = payload => ({
    type: actionTypes.TITLES_RECONCILE,
    payload,
});
