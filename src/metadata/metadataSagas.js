import {call, put, all, select, fork, take, takeEvery} from 'redux-saga/effects';
import {titleService} from '../containers/metadata/service/TitleService';
import * as actionTypes from './metadataActionTypes';

export function* fetchTitle(action) {
    const {payload} = action || {};
    const requestMethod = titleService.getTitleById;
    try {
        yield put({
            type: actionTypes.FETCH_TITLE_REQUEST,
            payload: {}
        });
        const response = yield call(requestMethod, payload.id);
        const {data} = response;
        yield put({
            type: actionTypes.FETCH_TITLE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_TITLE_ERROR,
            payload: null,
            error,
        });
    }
}

export function* fetchAndStoreTitle(action) {
        const {titleId} = yield select(state => state.metadata);
        const {id} = action.payload || {}; 
        if (id && id === titleId) {
            return;
        }

        yield fork(fetchTitle, action);

        while (true) {
            const {type, payload} = yield take([
                actionTypes.FETCH_TITLE_SUCCESS,
                actionTypes.FETCH_TITLE_ERROR,
            ]);

            if (type === actionTypes.FETCH_TITLE_SUCCESS) {
                yield put({
                    type: actionTypes.STORE_TITLE,
                    payload: {[payload.id]: payload},
                });

                break;
            }
        }
}

export function* metadataWatcher() {
    yield all([
        takeEvery(actionTypes.FETCH_AND_STORE_TITLE, fetchAndStoreTitle)
    ]);
}

