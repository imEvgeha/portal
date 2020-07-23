import * as actionTypes from './servicingOrderActionTypes';

export const saveFulfillmentOrder = payload => ({
    type: actionTypes.SAVE_FULFILLMENT_ORDER,
    payload,
});
