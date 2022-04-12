import {getConfig} from "@vubiquity-nexus/portal-utils/lib/config";
import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {cloneDeep, uniqBy} from 'lodash';
import {all, call, put, select, takeEvery} from 'redux-saga/effects';
import configEndpoints from './configEndpoints.json';
import * as actionTypes from './rightDetailsActionTypes';
import * as selectors from './rightDetailsSelector';

const formatSelectValues = values => {
    const selectValues = {};
    if (values) {
        values.forEach(opt => {
            if (opt) {
                const [key] = Object.keys(opt);
                selectValues[key] = cloneDeep(opt[key]);
            }
        });
    }
    return selectValues;
};

export function* getSelectValuesSaga() {
    let fetchedOptions = yield all(
        uniqBy(configEndpoints, 'configEndpoint').map(({field, configEndpoint}) => {
            return call(fetchSelectValuesSaga, configEndpoint, field);
        })
    );
    fetchedOptions = fetchedOptions.reduce((a, c) => ({...a, ...c}));
    const areValid = yield select(selectors.areValidSelector());
    if (areValid) {
        const options = configEndpoints.map(({field, configEndpoint}) => ({
            [field]: fetchedOptions[configEndpoint],
        }));
        const selectValues = formatSelectValues(options);
        yield put({
            type: actionTypes.STORE_SELECT_VALUES,
            payload: {selectValues, endpointsLoading: false},
        });
    }
}

const fetchSelectValues = endpoint => {
    const url = `${getConfig('gateway.configuration')}${getConfig(
        'gateway.service.configuration'
    )}${endpoint}?page=0&size=10000`;
    return nexusFetch(url, {isWithErrorHandling: false});
};

export function* fetchSelectValuesSaga(endpoint, field) {
    try {
        yield put({
            type: actionTypes.FETCH_SELECT_VALUES_REQUEST,
            payload: {
                message: `[${field}] REQUEST FOR FETCHING OPTIONS`,
            },
        });
        const response = yield call(fetchSelectValues, endpoint);
        yield put({
            type: actionTypes.FETCH_SELECT_VALUES_SUCCESS,
            payload: {
                message: `[${field}] OPTIONS FETCHED SUCCESSFULLY`,
            },
        });
        return {
            [endpoint]: response.data,
        };
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_SELECT_VALUES_ERROR,
            payload: {
                message: `[${field}] OPTIONS ARE NOT FETCHED`,
            },
        });
    }
}

export function* rightDetailsWatcher() {
    yield all([takeEvery(actionTypes.GET_SELECT_VALUES, getSelectValuesSaga)]);
}
