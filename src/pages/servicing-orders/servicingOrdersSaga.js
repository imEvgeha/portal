import {all, fork} from 'redux-saga/effects';
import {servicingOrderWatcher} from './servicing-order/servicingOrderSaga';

export function* servicingOrdersWatcher() {
    yield all([fork(servicingOrderWatcher)]);
}
