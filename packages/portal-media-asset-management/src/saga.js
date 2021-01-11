import {all, fork} from 'redux-saga/effects';
import {assetManagementWatcher} from './assetManagementSagas';

export default function* rootSaga() {
    yield all([fork(assetManagementWatcher)]);
}
