import {createSelector} from 'reselect';

const getIngestReducer = state => state.avails.ingest;

export const getIngests = createSelector(getIngestReducer, ingest => Object.values(ingest.list || {}));

export const getTotalIngests = createSelector(getIngestReducer, ingest => ingest.total);

export const getSelectedIngest = createSelector(getIngestReducer, ingest => ingest.list[ingest.selectedIngestId]);

export const getSelectedAttachmentId = createSelector(getIngestReducer, ingest => ingest.selectedAttachmentId);

export const getIngestById = createSelector(
    getIngests,
    (_, id) => id,
    (ingests, id) => ingests.find(ingest => ingest.id === id)
);

const getRoot = state => state.root;

export const getSelectValues = createSelector(getRoot, root => root.selectValues);

export const getLicensors = createSelector(getSelectValues, selectValues => selectValues.licensor || []);

export const getLicensees = createSelector(getSelectValues, selectValues => selectValues.licensee || []);
