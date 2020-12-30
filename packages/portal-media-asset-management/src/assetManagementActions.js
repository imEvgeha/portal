import {FETCH_POSTERS} from './assetManagementActionTypes';

export const fetchPosters = payload => ({
    type: FETCH_POSTERS,
    payload,
});
