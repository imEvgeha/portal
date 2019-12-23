import {createSelector} from 'reselect';

const getAvailsReducer = state => state.availsReducer;

export const getAvails = createSelector(
    getAvailsReducer,
    availsReducer => availsReducer.avails,
);