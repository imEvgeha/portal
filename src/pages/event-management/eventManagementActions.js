import * as actionTypes from './eventManagementActionTypes';

export const replayEvent = payload => ({
    type: actionTypes.REPLAY_EVENT,
    payload,
});

export const replicateEvent = payload => ({
    type: actionTypes.REPLICATE_EVENT,
    payload,
});
