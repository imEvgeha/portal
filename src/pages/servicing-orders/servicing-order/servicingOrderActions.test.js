import * as actions from './servicingOrderActions';
import * as actionTypes from './servicingOrderActionTypes';

describe('servicing order actions', () => {
    const payload = {};
    it('should create action to save fulfillment order', () => {
        const expectedAction = {
            type: actionTypes.SAVE_FULFILLMENT_ORDER,
            payload,
        };
        expect(actions.saveFulfillmentOrder(payload)).toEqual(expectedAction);
    });
});
