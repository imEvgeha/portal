import {get} from 'lodash';
import {call, put, all, takeEvery, select, fork} from 'redux-saga/effects';
import {FETCH_POSTERS, STORE_POSTERS} from './assetManagementActionTypes';
import {fetchPosters} from './assetManagementService';

function* resourcePosters({payload}) {
    try {
        const url = `http://vidispine-stg.misc.odg.ondemand.co.uk/API/item/${payload}/posterresource`;
        const resource = yield call(fetchPosters, url);
        const resourceURL = get(resource, 'uri[0]', '');
        const timeFrames = yield call(fetchPosters, resourceURL);
        const posters = [];
        get(timeFrames, 'uri', []).map(frame => {
            posters.push(`${resourceURL}/${frame}`);
        });
        yield put({
            type: STORE_POSTERS,
            payload: posters,
        });
    } catch (error) {
        // error handling here
    }
}

export function* assetManagementWatcher() {
    yield all([takeEvery(FETCH_POSTERS, resourcePosters)]);
}
