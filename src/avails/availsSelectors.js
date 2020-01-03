import {createSelector} from 'reselect';

const getAvailsReducer = state => state.availsReducer;

export const getAvails = createSelector(
    getAvailsReducer,
    availsReducer => availsReducer.avails,
);

export const getTotalAvails = createSelector(
    getAvailsReducer,
    availsReducer => availsReducer.total,
);

const getHistory = createSelector(
    getAvails,
    (_, historyId) => historyId,
    (avails, historyId) => avails.find(avail => avail.id === historyId) || {}
);

const getAttachmentId = (state, historyId, attachmentId) => attachmentId;

export const getIngest = createSelector(
    [getHistory, getAttachmentId],
    (history, attachmentId) => history.attachments && history.attachments.find(a => a.id === attachmentId) || {}
);