import {call, put, all, takeEvery, select} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import * as actionTypes from './rightsActionTypes';
import {URL} from '../../util/Common';

export function* storeRights({payload}) {
    try {
        yield put({
            type: actionTypes.STORE_RIGHTS,
            payload,
        });
    } catch (error) {
        yield put({
            type: actionTypes.STORE_RIGHTS_ERROR,
            payload: error,
        });
    }
}

export function* storeRightsFilter({payload}) {
    const {pathname} = yield select(state => state.router.location);
    const {external = {}, column = {}} = payload || {};
    const query = {...external, ...column};
    const url = `${pathname}?${URL.updateQueryParam(query || {})}`;
    try {
        // yield put(push(URL.keepEmbedded(url)));
        yield put({
            type: actionTypes.STORE_RIGHTS_FILTER_SUCCESS,
            payload,
        });
    } catch (error) {
        yield put({
            type: actionTypes.STORE_RIGHTS_FILTER_ERROR,
            payload: error,
        });
    }
}

export function* rightsWatcher() {
    yield all([
        takeEvery(actionTypes.STORE_RIGHTS_FILTER, storeRightsFilter),
    ]);
}
