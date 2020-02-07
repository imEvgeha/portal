import * as actionTypes from './metadataActionTypes';

export const fetchTitle = payload => ({
    type: actionTypes.FETCH_AND_STORE_TITLE,
    payload,
});

export const reconcileTitles = payload => ({
    type: actionTypes.TITLES_RECONCILE,
    payload,
});
