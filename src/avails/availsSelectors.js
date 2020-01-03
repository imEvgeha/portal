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