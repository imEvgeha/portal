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

export const getSelectedIngest = createSelector(
    getAvailsReducer,
    availsReducer => availsReducer.selectedIngest,
);

export const getIngestById = createSelector(
    getIngests,
    (_, id) => id,
    (ingests, id) =>ingests.find(ingest => ingest.id === id)
);