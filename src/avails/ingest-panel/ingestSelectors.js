import {createSelector} from 'reselect';

const getIngestReducer = state => state.avails.ingest;

export const getIngests = createSelector(
    getIngestReducer,
    ingest => ingest.ingests,
);

export const getTotalIngests = createSelector(
    getIngestReducer,
    ingest => ingest.totalIngests,
);

export const getSelectedIngest = createSelector(
    getIngestReducer,
    ingest => ingest.selectedIngest,
);

export const getIngestById = createSelector(
    getIngests,
    (_, id) => id,
    (ingests, id) =>ingests.find(ingest => ingest.id === id)
);

const getRoot = state => state.root;

export const getSelectValues = createSelector(
    getRoot,
    root => root.selectValues,
);

export const getLicensors = createSelector(
    getSelectValues,
    selectValues => selectValues.licensor || [],
);

export const getIsUploading = createSelector(
    getIngestReducer,
    ingest => ingest.isUploading,
);
