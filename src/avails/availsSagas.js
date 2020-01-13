import {all, fork} from 'redux-saga/effects';
import ingestWatcher from './ingest-panel/ingestSagas';

export default function* availsSaga() {
    yield all([
        fork(ingestWatcher),
    ]);
}
