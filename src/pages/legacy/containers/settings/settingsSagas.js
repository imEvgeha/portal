import {call, put, all, take, fork, takeEvery} from 'redux-saga/effects';
import * as actionTypes from './settingsActionTypes';
import {loadConfigAPIEndPoints} from '@vubiquity-nexus/portal-utils/lib/services/ConfigService';

export function* fetchConfigApiEndpoints(requestMethod) {
    try {
        yield put({
            type: actionTypes.FETCH_CONFIG_API_ENDPOINTS_REQUEST,
            payload: {},
        });
        const response = yield call(requestMethod);
        yield put({
            type: actionTypes.FETCH_CONFIG_API_ENDPOINTS_SUCCESS,
            payload: response,
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_CONFIG_API_ENDPOINTS_ERROR,
            payload: error,
            error: true,
        });
    }
}

export function* fetchAndStoreConfigApiEndpoints(requestMethod) {
    yield fork(fetchConfigApiEndpoints, requestMethod);
    while (true) {
        const fetchConfigurationResult = yield take([
            actionTypes.FETCH_CONFIG_API_ENDPOINTS_SUCCESS,
            actionTypes.FETCH_CONFIG_API_ENDPOINTS_ERROR,
        ]);
        if (!fetchConfigurationResult.error) {
            const {payload} = fetchConfigurationResult;
            yield put({
                type: actionTypes.STORE_CONFIG_API_ENDPOINTS,
                payload: payload || [],
            });
            break;
        }
    }
}

export function* settingsWatcher() {
    yield all([
        takeEvery(actionTypes.FETCH_CONFIG_API_ENDPOINTS, fetchAndStoreConfigApiEndpoints, loadConfigAPIEndPoints),
    ]);
}
