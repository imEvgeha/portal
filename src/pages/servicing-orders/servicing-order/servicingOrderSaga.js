import {all, call, put, takeLatest} from 'redux-saga/effects';
import {SUCCESS_ICON, SUCCESS_TITLE} from '../../../ui/elements/nexus-toast-notification/constants';
import {SAVE_FULFILLMENT_ORDER_SUCCESS_MESSAGE} from '../../../ui/toast/constants';
import {ADD_TOAST} from '../../../ui/toast/toastActionTypes';
import {saveFulfillmentOrder as saveFulfillmentOrderAPI} from '../servicingOrdersService';
import * as actionTypes from './servicingOrderActionTypes';

export function* saveFulfillmentOrder(requestMethod, {payload}) {
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

export function* servicingOrderWatcher() {
    yield all([takeLatest(actionTypes.SAVE_FULFILLMENT_ORDER, saveFulfillmentOrder, saveFulfillmentOrderAPI)]);
}
