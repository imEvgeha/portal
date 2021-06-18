import {SUCCESS_ICON, SUCCESS_TITLE} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants';
import {SAVE_FULFILLMENT_ORDER_SUCCESS_MESSAGE} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import {ADD_TOAST} from '@vubiquity-nexus/portal-ui/lib/toast/toastActionTypes';
import {all, call, put, takeLatest} from 'redux-saga/effects';
import {
    saveFulfillmentOrder as saveFulfillmentOrderAPI,
    getFulfilmentOrdersForServiceOrder,
    getLateReasons,
} from '../servicingOrdersService';
import {fetchAssetInfo, getBarCodes, populateAssetInfo} from './ServiceOrderUtils';
import * as actionTypes from './servicingOrderActionTypes';

function* fetchFulfillmentOrder(action) {
    try {
        yield put({type: 'RESET'});
        const FO = yield call(getFulfilmentOrdersForServiceOrder, action.payload.id);
        const barcodes = getBarCodes(FO.fulfillmentOrders);
        const assetInfo = yield fetchAssetInfo(barcodes);
        const fulfillmentOrders = populateAssetInfo(FO.fulfillmentOrders, assetInfo[0]);
        yield put({
            type: 'SAVE_ORDER',
            payload: {...FO, fulfillmentOrders, components: assetInfo[1]},
        });
    } catch (e) {
        yield put({type: 'FO_FETCH_FAILED', message: e.message});
    }
}

function* saveFulfillmentOrder(requestMethod, {payload}) {
    try {
        yield put({
            type: actionTypes.SAVE_FULFILLMENT_ORDER_REQUEST,
            payload: {},
        });

        yield call(requestMethod, payload);
        yield put({
            type: actionTypes.SAVE_FULFILLMENT_ORDER_SUCCESS,
            payload: {},
        });

        yield put({
            type: ADD_TOAST,
            payload: {
                title: SUCCESS_TITLE,
                icon: SUCCESS_ICON,
                isAutoDismiss: true,
                description: SAVE_FULFILLMENT_ORDER_SUCCESS_MESSAGE,
            },
        });
    } catch (error) {
        yield put({
            type: actionTypes.SAVE_FULFILLMENT_ORDER_ERROR,
            payload: error,
            error: true,
        });
    }
}

function* fetchLateReasons(action) {
    try {
        const lateReason = yield getLateReasons(action.payload);
        const lateFaults = {};
        // eslint-disable-next-line no-unused-expressions, no-return-assign
        lateReason?.data?.forEach(item => (lateFaults[item.lateFault] = item.lateReasons));
        yield put({type: 'SAVE_LATE_RESAONS', payload: {[action.payload]: lateFaults}});
    } catch (e) {
        yield put({type: 'GET_CONFIG_FAILED', message: e.message});
    }
}

export function* servicingOrderWatcher() {
    yield all([
        takeLatest(actionTypes.SAVE_FULFILLMENT_ORDER, saveFulfillmentOrder, saveFulfillmentOrderAPI),
        takeLatest('FETCH_FO', fetchFulfillmentOrder),
        takeLatest('FETCH_CONFIG', fetchLateReasons),
    ]);
}
