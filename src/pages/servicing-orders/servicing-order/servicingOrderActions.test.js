import * as actionTypes from './servicingOrderActionTypes';
import * as actions from './servicingOrderActions';

describe('servicing order actions', () => {
    let payload = {};
    it('should create action to save fulfillment order', () => {
        const expectedAction = {
            type: actionTypes.SAVE_FULFILLMENT_ORDER,
            payload,
        };
        expect(actions.saveFulfillmentOrder(payload)).toEqual(expectedAction);
    });
});
