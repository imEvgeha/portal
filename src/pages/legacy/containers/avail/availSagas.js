import React from 'react';
import {MULTISELECT_SEARCHABLE_DATA_TYPES} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import {
    ERROR_ICON,
    ERROR_TITLE,
    RIGHT_ERROR_MSG_MERGED,
    SUCCESS_TITLE,
} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import {all, call, fork, put, take, takeEvery} from 'redux-saga/effects';
import {addToast} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActions';
import {store} from '../../../../index';
import * as actionTypes from './availActionTypes';
import {profileService} from './service/ProfileService';
import {configurationService} from './service/ConfigurationService';
import {errorModal} from '../../components/modal/ErrorModal';
import {processOptions} from './util/ProcessSelectOptions';
import RightsURL from './util/RightsURL';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {BLOCK_UI} from '../../constants/action-types';
import {ADD_TOAST} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActionTypes';
import {STORE_PENDING_RIGHT} from '../../../avails/right-matching/rightMatchingActionTypes';
import ToastBody from '@vubiquity-nexus/portal-ui/lib/toast/components/toast-body/ToastBody';
import {Button} from 'primereact/button';
import isAllowed from '@vubiquity-nexus/portal-auth/lib/permissions/CheckPermissions';

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
    } catch (error) {
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
        const fetchMappingResult = yield take([
            actionTypes.FETCH_AVAIL_MAPPING_SUCCESS,
            actionTypes.FETCH_AVAIL_MAPPING_ERROR,
        ]);
        if (!fetchMappingResult.error) {
            const {payload} = fetchMappingResult;
            const mappings = payload.mappings || [];

            yield put({
                type: actionTypes.STORE_AVAIL_MAPPING,
                payload: {mappings},
            });
            break;
        }
        // open error modal
        // TODO refactor modal for error
        errorModal.open('Error', () => {}, {description: 'System is not configured correctly!', closable: false});
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
                [javaVariableName]: options.map(item => {
                    return {value: item, label: item};
                }),
            };
            return acc;
        }, {});
    const mappingsWithConfigEndpoint = multiSelectMappings.filter(el => el.configEndpoint);
    // TODO - make this in background via FORK effect
    const fields = [];

    const doesUserHaveRoles = isAllowed({
        operation: 'OR',
        values: ['configuration_viewer', 'configuration_user', 'configuration_admin'],
    });

    const fetchedSelectedItems = yield all(
        mappingsWithConfigEndpoint.map(({javaVariableName, configEndpoint, alternateSelector}) => {
            if (!fields.includes(configEndpoint)) {
                fields.push(configEndpoint);
                return call(
                    fetchAvailSelectValuesRequest,
                    profileService.getSelectValues(configEndpoint, alternateSelector),
                    configEndpoint,
                    javaVariableName
                );
            }
        })
    );

    const getFetchedSelectedItems = () => {
        if (doesUserHaveRoles) {
            return fetchedSelectedItems;
        } else {
            !doesUserHaveRoles &&
                store.dispatch(
                    addToast({
                        detail: `Access denied. User has no roles.`,
                        severity: 'error',
                    })
                );

            return mappingsWithConfigEndpoint;
        }
    };

    const deduplicate = (source, propName) => {
        return Array.from(
            source
                .reduce(
                    (acc, item) => item && item[propName] && acc.set(item[propName], item), // using map (preserves ordering)
                    new Map()
                )
                .values()
        );
    };

    const updatedSelectValues = getFetchedSelectedItems()
        ?.filter(Boolean)
        .reduce((acc, el) => {
            const values = Object.values(el);
            const {key, value = [], configEndpoint} = (Array.isArray(values) && values[0]) || {};
            const options = deduplicate(
                processOptions(value, configEndpoint),
                key === 'rating.ratingValue' ? 'label' : 'value'
            );
            let dopOptions = {};
            if (configEndpoint === '/languages') {
                dopOptions.language = options;
            }
            if (configEndpoint === '/countries') {
                dopOptions.locale = options;
            }
            acc = {
                ...acc,
                ...dopOptions,
                [key]: options,
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
            },
        };
    } catch (error) {
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
        const fetchConfigurationResult = yield take([
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

export function* handleMatchingRights({payload}) {
    const {error, right, isEdit, push, removeToast} = payload;
    const {message: {mergeRights, message, rightIDs} = {}, status} = error || {};
    const toastProps = {
        severity: ERROR_ICON,
        detail: message,
    };
    yield put({
        type: BLOCK_UI,
        payload: false,
    });

    if (status === 409 && !mergeRights) {
        yield put({
            type: ADD_TOAST,
            payload: {
                ...toastProps,
                content: (
                    <ToastBody summary={ERROR_TITLE} detail={message} severity={'error'}>
                        {rightIDs.map(right => (
                            <Button
                                label={right}
                                className="p-button-link p-toast-button-link"
                                onClick={() => window.open(RightsURL.getRightUrl(right), '_blank')}
                            />
                        ))}
                    </ToastBody>
                ),
            },
        });
    } else if (status === 409 && mergeRights) {
        yield put({
            type: STORE_PENDING_RIGHT,
            payload: {pendingRight: {...right, status: 'Pending', id: null}},
        });
        yield put({
            type: ADD_TOAST,
            payload: {
                ...toastProps,
                content: (
                    <ToastBody
                        summary={SUCCESS_TITLE}
                        detail={TITLE_MATCH_AND_CREATE_SUCCESS_MESSAGE}
                        severity="success"
                    >
                        <Button
                            label={RIGHT_ERROR_MSG_MERGED}
                            className="p-button-link p-toast-button-link"
                            onClick={() => {
                                removeToast();
                                push(URL.keepEmbedded('/avails/right-matching'));
                            }}
                        />
                    </ToastBody>
                ),
            },
        });
    } else {
        yield put({
            type: ADD_TOAST,
            payload: {
                ...toastProps,
            },
        });
    }
}

export function* availWatcher() {
    yield all([
        takeEvery(actionTypes.FETCH_AVAIL_MAPPING, fetchAndStoreAvailMapping, profileService.getAvailsMapping),
        takeEvery(
            actionTypes.FETCH_AVAIL_CONFIGURATION,
            fetchAndStoreAvailConfiguration,
            configurationService.getConfiguration
        ),
        takeEvery(actionTypes.HANDLE_MATCHING_RIGHTS, handleMatchingRights),
    ]);
}
