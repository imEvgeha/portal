import {call, put, all, take, fork, takeEvery} from 'redux-saga/effects';
import * as actionTypes from './availActionTypes';
import {profileService} from './service/ProfileService';
import {configurationService} from './service/ConfigurationService';
import {errorModal} from '../../components/modal/ErrorModal';
import {getSortedData} from '../../util/Common';

const PRODUCTION_STUDIOS = '/production-studios';
const LANGUAGES = '/languages';
const SORT_TYPE = 'label';

export function* fetchAvailMapping(requestMethod) {
    try {
        yield put({
            type: actionTypes.FETCH_AVAIL_MAPPING_REQUEST,
            paylaod: {},
        });
        const response = yield call(requestMethod);
        const {data} = response;
        yield put({
            type: actionTypes.FETCH_AVAIL_MAPPING_SUCCESS,
            // TODO - check why we have mappings prop inside availsMappings store
            payload: data,
        });
        yield fork(fetchAndStoreSelectItems, data && data.mappings);
    } catch(error) {
        yield put({
            type: actionTypes.FETCH_AVAIL_MAPPING_ERROR,
            error: true,
            payload: error,
        });
    }
}

export function* fetchAndStoreAvailMapping(requestMethod) {
    yield fork(fetchAvailMapping, requestMethod);
    while (true) {
        const fetchMappingResult  = yield take([
            actionTypes.FETCH_AVAIL_MAPPING_SUCCESS,
            actionTypes.FETCH_AVAIL_MAPPING_ERROR,
        ]);
        if (!fetchMappingResult.error) {
            const {payload} = fetchMappingResult;
            const mappings = (payload.mappings && payload.mappings.filter(el => el.displayName)) || [];
            yield put({
                type: actionTypes.STORE_AVAIL_MAPPING,
                payload: {mappings},
            });
            break;
        }
        // open error modal
        // TODO refactor modal for error
        errorModal.open('Error', () => { }, { description: 'System is not configured correctly!', closable: false });
        break;
    }
}

export function* fetchAndStoreSelectItems(payload) {
    const multiSelectMappings = payload.filter(el => el.searchDataType === 'multiselect' );
    const mappingsWithOptions = multiSelectMappings
        .filter(el => el.options)
        .reduce((acc, {javaVariableName, options}) => {
            acc = {
                ...acc,
                [javaVariableName]: options
            };
            return acc;
        }, {});
    const mappingsWithConfigEndpoint = multiSelectMappings.filter(el => el.configEndpoint);
    // TODO - make this in background via FORK effect
    const fetchedSelectedItems = yield all(
        mappingsWithConfigEndpoint.map(({javaVariableName, configEndpoint}) => {
            return call(fetchAvailSelectValuesRequest, profileService.getSelectValues, configEndpoint, javaVariableName);
        })
    );
    const updatedSelectValues = fetchedSelectedItems.filter(Boolean).reduce((acc, el) => {
        const values = Object.values(el);
        const {key, value = [], configEndpoint} = (Array.isArray(values) && values[0]) || {};
        let options;
        switch (configEndpoint) {
            case PRODUCTION_STUDIOS:
                options = value.map(el => el.value === el.name);
                break;
            case LANGUAGES:
                options = value.map(code => {
                    return {value: code.languageCode, label: code.languageName};
                });
                options = getSortedData(options, SORT_TYPE, true);
                break;
            default:
                options = value;
        }
        acc = {
            ...acc,
            [key]: options 
        };
        return acc;
    }, {});

    const selectedItemsForStore = {
        ...mappingsWithOptions,
        ...updatedSelectValues,
    };
    yield put({
        type: actionTypes.STORE_AVAIL_SELECT_LIST,
        payload: selectedItemsForStore,
    });
}

export function* fetchAvailSelectValuesRequest(requestMethod, requestParams, key) {
    try {
        yield put({
            type: actionTypes.FETCH_AVAIL_SELECT_VALUES_REQUEST,
            paylaod: {},
        });
        const response = yield call(requestMethod, requestParams);
        yield put({
            type: actionTypes.FETCH_AVAIL_SELECT_VALUES_SUCCESS,
            paylaod: response,
        });
        return {
            [key]: {
                key,
                value: response.data.data,
                configEndpoint: requestParams,
            }
        };
    } catch(error) {
        yield put({
            type: actionTypes.FETCH_AVAIL_SELECT_VALUES_ERROR,
            error: true,
            payload: error,
        });
        // return {
        //     [key]: {
        //         key,
        //         value: error,
        //         configEndpoint: requestParams,
        //     }
        // };
    }
}

export function* fetchAvailConfiguration(requestMethod) {
    try {
        yield put({
            type: actionTypes.FETCH_AVAIL_CONFIGURATION_REQUEST,
            paylaod: {},
        });
        const response = yield call(requestMethod);
        const {data} = response;
        yield put({
            type: actionTypes.FETCH_AVAIL_CONFIGURATION_SUCCESS,
            paylaod: data,
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_AVAIL_CONFIGURATION_ERROR,
            paylaod: error,
            error: true,
        });
    }
}

// load avail configuration into the store
export function* fetchAndStoreAvailConfiguration(requestMethod) {
    yield fork(fetchAvailConfiguration, requestMethod);
    while (true) {
        const fetchConfigurationResult  = yield take([
            actionTypes.FETCH_AVAIL_CONFIGURATION_SUCCESS,
            actionTypes.FETCH_AVAIL_CONFIGURATION_ERROR,
        ]);
        if (!fetchConfigurationResult.error) {
            const {payload} = fetchConfigurationResult;
            yield put({
                type: actionTypes.STORE_AVAIL_CONFIGURATION_REPORTS,
                payload: (payload && payload.avails && payload.avails.reports) || [],
            });
            break;
        }
        // TODO - refactor modal
        errorModal.open('Error', () => {}, {description: 'System is not configured correctly!', closable: false});
    }
}

export function* availWatcher() {
    yield all([
        takeEvery(actionTypes.FETCH_AVAIL_MAPPING, fetchAndStoreAvailMapping, profileService.getAvailsMapping),
        takeEvery(actionTypes.FETCH_AVAIL_CONFIGURATION, fetchAndStoreAvailConfiguration, configurationService.getConfiguration),
    ]);
}
