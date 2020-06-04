import {call, put, all, take, fork, takeEvery} from 'redux-saga/effects';
import * as actionTypes from './availActionTypes';
import {profileService} from './service/ProfileService';
import {configurationService} from './service/ConfigurationService';
import {errorModal} from '../../components/modal/ErrorModal';
import {getSortedData} from '../../../../util/Common';
import {MULTISELECT_SEARCHABLE_DATA_TYPES} from "../../../../ui/elements/nexus-grid/constants";
import { PRODUCTION_STUDIOS, AFFILIATES, AUDIO_TYPES, CONTENT_TYPES, COUNTRIES, CURRENCIES, FORMATS, GENRES, LANGUAGES,
    LICENSE_RIGHT_DESC, LICENSEES, LICENSOR, NG_AUDIOS, RATING_SYSTEMS, RATINGS, REGION, SORT_TYPE, LICENSE_TYPES
    } from './constants';

export function* fetchAvailMapping(requestMethod) {
    try {
        yield put({
            type: actionTypes.FETCH_AVAIL_MAPPING_REQUEST,
            payload: {},
        });
        const response = yield call(requestMethod);
        yield put({
            type: actionTypes.FETCH_AVAIL_MAPPING_SUCCESS,
            // TODO - check why we have mappings prop inside availsMappings store
            payload: response,
        });
        yield fork(fetchAndStoreSelectItems, response && response.mappings);
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
            const mappings = (payload.mappings && payload.mappings.filter(el => el.dataType).filter(el => el.displayName)) || [];
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

export function* fetchAndStoreSelectItems(payload, type) {
    const multiSelectMappings = payload.filter(el => MULTISELECT_SEARCHABLE_DATA_TYPES.includes(el.searchDataType));
    const mappingsWithOptions = multiSelectMappings
        .filter(el => el.options)
        .reduce((acc, {javaVariableName, options}) => {
            acc = {
                ...acc,
                [javaVariableName]: options.map(item => { return { value: item, label: item } })
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

    const deduplicate = (source, propName) => {
        return Array.from(
            source
                .reduce(
                    (acc, item) => (
                        item && item[propName] && acc.set(item[propName], item),
                            acc
                    ), // using map (preserves ordering)
                    new Map()
                )
                .values()
        );
    }

    const updatedSelectValues = fetchedSelectedItems.filter(Boolean).reduce((acc, el) => {
        const values = Object.values(el);
        const {key, value = [], configEndpoint} = (Array.isArray(values) && values[0]) || {};
        let options;
        switch (configEndpoint) {
            case PRODUCTION_STUDIOS:
            case LICENSOR:
            case LICENSEES:
            case LICENSE_TYPES:
            case CONTENT_TYPES:
            case AFFILIATES:
            case CURRENCIES:
            case FORMATS:
            case LICENSE_RIGHT_DESC:
            case NG_AUDIOS:
            case RATING_SYSTEMS:
                options = value.map(code => {
                    return {value: code.name || code.value, label: code.name || code.value};
                });
                options = getSortedData(options, SORT_TYPE, true);
                break;
            case LANGUAGES:
                options = value.map(code => {
                    return {value: code.languageCode, label: code.languageName};
                });
                options = getSortedData(options, SORT_TYPE, true);
                break;
            case REGION:
                options = value.map(code => {
                    return {value: code.regionCode, label: code.regionName};
                });
                options = getSortedData(options, SORT_TYPE, true);
                break;
            case GENRES:
                options = value.map(code => {
                    return {value: code.name, label: code.name};
                });
                options = getSortedData(options, SORT_TYPE, true);
                break;
            case COUNTRIES:
                options = value.map(code => {
                    return {value: code.countryCode, label: code.countryName}
                });
                options = getSortedData(options, SORT_TYPE, true);
                break;
            case RATINGS:
                options = value.map(code => {
                    return {value: code.value, label: code.ratingSystem + ' - ' + code.value}
                });
                options = getSortedData(options, SORT_TYPE, true);
                break;
            case AUDIO_TYPES:
                options = value.map(code => {
                    return {value: code.value, label: code.value}
                });
                options = getSortedData(options, SORT_TYPE, true);
                break;
            default:
                options = value;
        }

        const label = options.find(item => item.value) ? 'value' : 'label';

        options = deduplicate(options, label);

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
            payload: {},
        });
        const response = yield call(requestMethod, requestParams);
        yield put({
            type: actionTypes.FETCH_AVAIL_SELECT_VALUES_SUCCESS,
            payload: response,
        });
        return {
            [key]: {
                key,
                value: response.data,
                configEndpoint: requestParams,
            }
        };
    } catch(error) {
        yield put({
            type: actionTypes.FETCH_AVAIL_SELECT_VALUES_ERROR,
            error: true,
            payload: error,
        });
    }
}

export function* fetchAvailConfiguration(requestMethod) {
    try {
        yield put({
            type: actionTypes.FETCH_AVAIL_CONFIGURATION_REQUEST,
            payload: {},
        });
        const data = yield call(requestMethod);
        yield put({
            type: actionTypes.FETCH_AVAIL_CONFIGURATION_SUCCESS,
            payload: data,
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_AVAIL_CONFIGURATION_ERROR,
            payload: error,
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
