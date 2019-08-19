import {all, fork} from 'redux-saga/effects';
import {availWatcher} from './containers/avail/availSagas';

export default function* rootSaga() {
    yield all([
        fork(availWatcher),
    ]);
}
