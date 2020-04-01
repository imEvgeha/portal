import {all, fork} from 'redux-saga/effects';
import {availWatcher} from './containers/avail/availSagas';
import {settingsWatcher} from './containers/settings/settingsSagas';
import {rightMatchingWatcher} from './avails/right-matching/rightMatchingSagas';
import {titleMatchingWatcher} from './avails/title-matching/titleMatchingSagas';
import rightHistoryWatcher from './avails/right-history-view/rightHistorySagas';
import availsWatcher from './avails/availsSagas';
import {metadataWatcher} from './metadata/metadataSagas';

export default function* rootSaga() {
    yield all([
        fork(availWatcher),
        fork(settingsWatcher),
        fork(rightMatchingWatcher),
        fork(titleMatchingWatcher),
        fork(rightHistoryWatcher),
        fork(availsWatcher),
        fork(metadataWatcher),
    ]);
}

