import {all, fork} from 'redux-saga/effects';
import availsWatcher from './pages/avails/availsSagas';
import {rightMatchingWatcher} from './pages/avails/right-matching/rightMatchingSagas';
import {titleMatchingWatcher} from './pages/avails/title-matching/titleMatchingSagas';
import dopTasksWatcher from './pages/dop-tasks/dopTasksSagas';
import {eventManagementWatcher} from './pages/event-management/eventManagementSagas';
import {availWatcher} from './pages/legacy/containers/avail/availSagas';
import {endpointConfigWatcher} from './pages/legacy/containers/avail/service/endpointConfigSagas';
import {assetManagementWatcher} from './pages/manual-tasks/asset-management/assetManagementSagas';
import {metadataWatcher} from './pages/metadata/metadataSagas';
import {servicingOrdersWatcher} from './pages/servicing-orders/servicingOrdersSaga';
import {settingsWatcher} from './pages/settings/settingsSagas';
import {titleMetadataWatcher} from './pages/title-metadata/TitleMetadataSagas';

export default function* rootSaga() {
    yield all([
        fork(availWatcher),
        fork(settingsWatcher),
        fork(rightMatchingWatcher),
        fork(titleMatchingWatcher),
        fork(availsWatcher),
        fork(metadataWatcher),
        fork(eventManagementWatcher),
        fork(servicingOrdersWatcher),
        fork(titleMetadataWatcher),
        fork(dopTasksWatcher),
        fork(assetManagementWatcher),
        fork(endpointConfigWatcher),
    ]);
}
