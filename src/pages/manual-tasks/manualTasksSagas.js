import {all, fork} from 'redux-saga/effects';
import {assetManagementWatcher} from './asset-management/assetManagementSagas';

export default function* assetManagementSaga() {
    yield all([fork(assetManagementWatcher)]);
}
