import {all, fork} from 'redux-saga/effects';
import ingestWatcher from './ingest-panel/ingestSagas';
import {rightsWatcher} from './rights-repository/rightsSagas';

export default function* availsSaga() {
    yield all([fork(ingestWatcher), fork(rightsWatcher)]);
}
