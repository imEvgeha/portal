import React from 'react';
import {put, all, takeEvery} from 'redux-saga/effects';
import {
    HANDLE_CONFIG_ENDPOINT_ERROR,
    HANDLE_CONFIG_ENDPOINT_SUCCESS,
    HANDLE_CONFIG_ENDPOINT_VALUES,
} from './endpointConfigActions';

export function* fetchAndStoreEndpointConfig({payload}) {
    try {
        yield put({
            type: HANDLE_CONFIG_ENDPOINT_SUCCESS,
            payload,
        });
    } catch (error) {
        yield put({
            type: HANDLE_CONFIG_ENDPOINT_ERROR,
            payload: error,
        });
    }
}

export function* endpointConfigWatcher() {
    yield all([takeEvery(HANDLE_CONFIG_ENDPOINT_VALUES, fetchAndStoreEndpointConfig)]);
}
