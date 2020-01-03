import {createSelector} from 'reselect';

const getAvailsReducer = state => state.availsReducer;

export const getIngests = createSelector(
    getAvailsReducer,
    availsReducer => availsReducer.ingests,
);

export const getTotalIngests = createSelector(
    getAvailsReducer,
    availsReducer => availsReducer.totalIngests,
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