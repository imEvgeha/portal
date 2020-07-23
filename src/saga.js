import {all, fork} from 'redux-saga/effects';
import availsWatcher from './pages/avails/availsSagas';
import rightHistoryWatcher from './pages/avails/right-history-view/rightHistorySagas';
import {rightMatchingWatcher} from './pages/avails/right-matching/rightMatchingSagas';
import {titleMatchingWatcher} from './pages/avails/title-matching/titleMatchingSagas';
import {eventManagementWatcher} from './pages/event-management/eventManagementSagas';
import {availWatcher} from './pages/legacy/containers/avail/availSagas';
import {settingsWatcher} from './pages/legacy/containers/settings/settingsSagas';
import {metadataWatcher} from './pages/metadata/metadataSagas';
import {servicingOrdersWatcher} from './pages/servicing-orders/servicingOrdersSaga';

export default function* rootSaga() {
    yield all([
        fork(availWatcher),
        fork(settingsWatcher),
        fork(rightMatchingWatcher),
        fork(titleMatchingWatcher),
        fork(rightHistoryWatcher),
        fork(availsWatcher),
        fork(metadataWatcher),
        fork(eventManagementWatcher),
        fork(servicingOrdersWatcher),
    ]);
}

