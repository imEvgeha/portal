import * as actionTypes from './ingestActionTypes';

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
    if (payload.selectedAttachmentId && payload.selectedAttachmentId === payload.attachmentId) {
        return {
            type: actionTypes.DESELECT_INGEST,
        };
    }
    return {
        type: actionTypes.SELECT_INGEST,
        payload,
    };
};

export const deselectIngest = () => ({
    type: actionTypes.DESELECT_INGEST,
});

export const uploadIngest = payload => ({
    type: actionTypes.UPLOAD_INGEST,
    payload,
});

export const downloadEmailAttachment = payload => ({
    type: actionTypes.DOWNLOAD_INGEST_EMAIL,
    payload,
});

export const downloadFileAttachment = payload => ({
    type: actionTypes.DOWNLOAD_INGEST_FILE,
    payload,
});
