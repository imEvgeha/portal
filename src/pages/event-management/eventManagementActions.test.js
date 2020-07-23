import * as actionTypes from './eventManagementActionTypes';
import * as actions from './eventManagementActions';

describe('event management actions', () => {
    const payload = {};
    it('should create action to replay event', () => {
        const expectedAction = {
            type: actionTypes.REPLAY_EVENT,
            payload,
        };
        expect(actions.replayEvent(payload)).toEqual(expectedAction);
    });
    it('should create action to replicate event', () => {
        const expectedAction = {
            type: actionTypes.REPLICATE_EVENT,
            payload,
        };
        expect(actions.replicateEvent(payload)).toEqual(expectedAction);
    });
});
