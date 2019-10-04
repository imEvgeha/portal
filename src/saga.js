import {all, fork} from 'redux-saga/effects';
import {availWatcher} from './containers/avail/availSagas';
import {settingsWatcher} from './containers/settings/settingsSagas';
import {rightMatchingWatcher} from './avails/right-matching/rightMatchingSagas';

export default function* rootSaga() {
    yield all([
        fork(availWatcher),
        fork(settingsWatcher),
        fork(rightMatchingWatcher),
    ]);
}
