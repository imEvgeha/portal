import actionTypes from './ingestActionTypes';

export const fetchIngests = payload => ({
    type: actionTypes.FETCH_INGESTS,
    payload,
});

export const fetchNextPage = () => ({
    type: actionTypes.FETCH_NEXT_PAGE,
});

export const filterRightsByStatus = payload => ({
    type: actionTypes.FILTER_RIGHTS_BY_STATUS,
    payload,
});

export const selectIngest = (payload = {}) => {
    if (payload.selectedAttachmentId === payload.attachmentId) {
        return {
            type: actionTypes.DESELECT_INGEST
        };
    } else {
        return {
            type: actionTypes.SELECT_INGEST,
            payload,
        };
    }
};