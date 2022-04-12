import React from 'react';
import {ADD_TOAST} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActionTypes';
import ToastBody from '@vubiquity-nexus/portal-ui/lib/toast/components/toast-body/ToastBody';
import {
    SAVE_COMBINED_RIGHT_SUCCESS_MESSAGE,
    SUCCESS_ICON,
    SUCCESS_TITLE,
    WARNING_TITLE,
} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import {Button} from 'primereact/button';
import {goBack, push} from 'redux-first-history';
import {all, call, fork, put, select, take, takeEvery, takeLatest} from 'redux-saga/effects';
import {SET_LOCALE} from '../../legacy/constants/action-types';
import {FETCH_AVAIL_MAPPING, STORE_AVAIL_MAPPING} from '../../legacy/containers/avail/availActionTypes';
import {NULL_TO_ARRAY, NULL_TO_OBJECT} from '../../legacy/containers/avail/service/Constants';
import {rightsService} from '../../legacy/containers/avail/service/RightsService';
import {createColumnDefs} from '../utils';
import * as actionTypes from './rightMatchingActionTypes';
import {WARNING_CONFLICTING_RIGHTS} from './rightMatchingConstants';
import {getCombinedRight, getMatchingCandidates, getRightMatchingList, putCombinedRight} from './rightMatchingService';

// TODO - refactor this worker saga (use select)
export function* createRightMatchingColumnDefs() {
    const {availsMapping} = yield select(state => state.root);
    try {
        const {mappings = []} = availsMapping || {};
        if (mappings.length) {
            const columnDefs = yield call(createColumnDefs, mappings);
            yield put({
                type: actionTypes.STORE_RIGHT_MATCHING_COLUMN_DEFS,
                payload: {columnDefs},
            });
            return;
        }
        yield put({
            type: FETCH_AVAIL_MAPPING,
            payload: {},
        });
        while (true) {
            const {payload} = yield take(STORE_AVAIL_MAPPING);
            if (payload && payload.mappings) {
                const columnDefs = yield call(createColumnDefs, payload.mappings);
                yield put({
                    type: actionTypes.STORE_RIGHT_MATCHING_COLUMN_DEFS,
                    payload: {columnDefs},
                });
            }
            break;
        }
    } catch (error) {
        throw new Error();
    }
}

function* fetchFocusedRight(action) {
    const requestMethod = rightsService.get;
    try {
        yield put({
            type: actionTypes.FETCH_FOCUSED_RIGHT_REQUEST,
            payload: {},
        });
        const data = yield call(requestMethod, action.payload);
        yield put({
            type: actionTypes.FETCH_FOCUSED_RIGHT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_FOCUSED_RIGHT_ERROR,
            payload: error,
        });
    }
}

function* fetchAndStoreFocusedRight(action) {
    yield fork(fetchFocusedRight, action);

    while (true) {
        const fetchFocusedRightResult = yield take([
            actionTypes.FETCH_FOCUSED_RIGHT_SUCCESS,
            actionTypes.FETCH_FOCUSED_RIGHT_ERROR,
        ]);

        if (fetchFocusedRightResult.type === actionTypes.FETCH_FOCUSED_RIGHT_SUCCESS) {
            yield put({
                type: actionTypes.STORE_FOCUSED_RIGHT,
                payload: {focusedRight: fetchFocusedRightResult.payload},
            });
            break;
        }
    }
}

function* storeMatchedRights({payload}) {
    const {rightsForMatching} = payload;
    yield put({
        type: actionTypes.STORE_MATCHED_RIGHTS_SUCCESS,
        payload: {rightsForMatching},
    });
}

export function* fetchMatchedRights(requestMethod, {payload}) {
    try {
        yield put({
            type: actionTypes.FETCH_MATCHED_RIGHT_REQUEST,
            payload: {},
        });

        const matchedRights = [];
        for (const id of payload) {
            const response = yield call(requestMethod, id);
            matchedRights.push(response);
        }

        yield put({
            type: actionTypes.STORE_MATCHED_RIGHTS_SUCCESS,
            payload: {rightsForMatching: matchedRights},
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_MATCHED_RIGHT_ERROR,
            payload: error,
            error: true,
        });
    }
}

export function* fetchCombinedRight(requestMethod, {payload}) {
    const {rights, rightIds, mapping} = payload || {};
    try {
        yield put({
            type: actionTypes.FETCH_COMBINED_RIGHT_REQUEST,
            payload: {},
        });

        const combinedRight = yield call(requestMethod, rightIds, rights);
        // fix fields that are null but include subfields
        mapping.forEach(({javaVariableName}) => {
            const dotIndex = javaVariableName.indexOf('.');
            // has subfield
            if (dotIndex >= 0) {
                const field = javaVariableName.substring(0, dotIndex);
                if (combinedRight[field] === null && NULL_TO_OBJECT.includes(field)) {
                    combinedRight[field] = {};
                }
                if (combinedRight[field] === null && NULL_TO_ARRAY.includes(field)) {
                    combinedRight[field] = [];
                }
            }
        });
        yield put({
            type: actionTypes.FETCH_COMBINED_RIGHT_SUCCESS,
            payload: {combinedRight},
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_COMBINED_RIGHT_ERROR,
            payload: {combinedRight: {}},
            error: true,
        });
    }
}

export function* saveCombinedRight(requestMethod, {payload}) {
    const {rightIds, combinedRight, redirectPath} = payload || {};
    try {
        yield put({
            type: actionTypes.SAVE_COMBINED_RIGHT_REQUEST,
            payload: {},
        });
        const focusedRight = yield call(requestMethod, rightIds, combinedRight);

        yield put({
            type: actionTypes.SAVE_COMBINED_RIGHT_SUCCESS,
            payload: {focusedRight},
        });

        if (redirectPath) {
            yield put(push(URL.keepEmbedded(redirectPath)));
        }

        const handleToastButtonClick = () => {
            window.open(`/avails/rights/${focusedRight.id}`, '_blank');
        };

        yield put({
            type: ADD_TOAST,
            payload: {
                severity: SUCCESS_ICON,
                content: (
                    <ToastBody summary={SUCCESS_TITLE} detail={SAVE_COMBINED_RIGHT_SUCCESS_MESSAGE} severity="success">
                        {URL.isEmbedded() ? (
                            <Button
                                label="View Title"
                                className="p-button-link p-toast-button-link"
                                onClick={handleToastButtonClick}
                            />
                        ) : null}
                    </ToastBody>
                ),
            },
        });
    } catch (error) {
        yield put({
            type: actionTypes.SAVE_COMBINED_RIGHT_ERROR,
            payload: error,
        });
    }
}

export function* fetchMatchRightUntilFindId(requestMethod, {payload}) {
    try {
        const {id, pageSize, searchParams} = payload || {};
        let {pageNumber} = payload || {};

        let rightMatchPageData = {};
        let isIdFounded = false;
        let isBoundaryValue = false;
        while (!isIdFounded || isBoundaryValue) {
            const response = yield call(requestMethod, searchParams, pageNumber, pageSize, null);
            const ids = response.data.map(el => el.id);
            if (ids.length === 0) {
                break;
            }
            isIdFounded = ids.includes(id);

            const pages = {};
            pages[pageNumber] = ids;
            rightMatchPageData = {
                pages: {...rightMatchPageData.pages, ...pages},
                total: response.total,
            };

            if (isBoundaryValue || ids.length < pageSize) {
                break;
            }
            isBoundaryValue = isIdFounded && ids[ids.length - 1] === id;

            pageNumber += 1;
        }

        yield put({
            type: actionTypes.STORE_RIGHT_MATCH_DATA_WITH_IDS,
            payload: {rightMatchPageData},
        });
    } catch (error) {
        yield put({
            type: actionTypes.FETCH_RIGHT_MATCH_DATA_UNTIL_FIND_ID_FAILED,
            payload: error,
            error: true,
        });
    }
}

export function* validateConflictingRights({payload}) {
    const {rightId, tpr, rightData, selectedRights, callback, setMatchingCandidates} = payload || {};
    try {
        let conflictingRights = yield call(getMatchingCandidates, rightId, tpr, rightData);
        conflictingRights = conflictingRights.filter(r => r.id !== rightId); // as candidates API returns pending right in response
        const conflictingRightsIds = conflictingRights.map(right => right.id);

        if (selectedRights.every(right => conflictingRightsIds.includes(right))) {
            callback();
        } else {
            setMatchingCandidates ? setMatchingCandidates(conflictingRights) : yield put(goBack());
            yield put({
                type: ADD_TOAST,
                payload: {
                    severity: 'warn',
                    summary: WARNING_TITLE,
                    detail: WARNING_CONFLICTING_RIGHTS,
                    sticky: true,
                },
            });
        }
    } catch (error) {
        yield put({
            type: ADD_TOAST,
            payload: {
                severity: 'warn',
                summary: WARNING_TITLE,
                detail: WARNING_CONFLICTING_RIGHTS,
                sticky: true,
            },
        });
    }
}

export function* rightMatchingWatcher() {
    yield all([
        takeLatest(actionTypes.CREATE_RIGHT_MATCHING_COLUMN_DEFS, createRightMatchingColumnDefs),
        takeLatest(SET_LOCALE, createRightMatchingColumnDefs),
        takeEvery(actionTypes.FETCH_AND_STORE_FOCUSED_RIGHT, fetchAndStoreFocusedRight),
        takeEvery(actionTypes.STORE_MATCHED_RIGHTS, storeMatchedRights),
        takeEvery(actionTypes.FETCH_MATCHED_RIGHT, fetchMatchedRights, rightsService.get),
        takeEvery(actionTypes.FETCH_COMBINED_RIGHT, fetchCombinedRight, getCombinedRight),
        takeEvery(actionTypes.SAVE_COMBINED_RIGHT, saveCombinedRight, putCombinedRight),
        takeEvery(actionTypes.FETCH_RIGHT_MATCH_DATA_UNTIL_FIND_ID, fetchMatchRightUntilFindId, getRightMatchingList),
        takeEvery(actionTypes.VALIDATE_CONFLICTING_RIGHTS, validateConflictingRights),
    ]);
}
