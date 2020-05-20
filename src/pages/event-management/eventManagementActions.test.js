import * as actions from './eventManagementActions';
import * as actionTypes from './eventManagementActionTypes';

describe('event management actions', () => {
    let payload = {};
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
