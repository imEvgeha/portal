import {all, fork} from 'redux-saga/effects';
import ingestWatcher from './ingest-panel/ingestSagas';
import {rightDetailsWatcher} from './right-details/rightDetailsSagas';
import {rightsWatcher} from './rights-repository/rightsSagas';

export default function* availsSaga() {
    yield all([fork(ingestWatcher), fork(rightsWatcher), fork(rightDetailsWatcher)]);
}
