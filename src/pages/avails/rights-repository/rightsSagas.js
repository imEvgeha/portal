import {ADD_TOAST} from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotificationActionTypes';
import {
    ERROR_ICON,
    MAX_CHARS,
    SUCCESS_ICON,
    UPDATE_RIGHT_FAILED,
    UPDATE_RIGHT_SUCCESS_MESSAGE,
} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import {getAuthConfig} from "@vubiquity-nexus/portal-utils/lib/config";
import {getLinkedToOriginalRightsV2, bulkDeleteRights} from '@vubiquity-nexus/portal-utils/lib/services/availsService';
import {all, call, put, takeEvery} from 'redux-saga/effects';
import {history} from '../../../index';
import {rightsService} from '../../legacy/containers/avail/service/RightsService';
import {postReSync} from '../status-log-rights-table/StatusLogService';
import {POST_RESYNC_RIGHTS} from '../status-log-rights-table/statusLogActionTypes';
import * as actionTypes from './rightsActionTypes';

export function* storeRightsFilter({payload}) {
    try {
        yield put({
            type: actionTypes.ADD_RIGHTS_FILTER_SUCCESS,
            payload,
        });
    } catch (error) {
        yield put({
            type: actionTypes.ADD_RIGHTS_FILTER_ERROR,
            payload: error,
        });
    }
}

export function* resyncUpdate({payload}) {
    try {
        yield call(postReSync, payload);
        yield put({
            type: ADD_TOAST,
            payload: {
                severity: SUCCESS_ICON,
                detail: `Successfully updated`,
            },
        });
    } catch (error) {}
}

export function* fetchLinkedToOriginalRights({payload}) {
    const {rights, closeModal, toggleRefreshGridData} = payload || {};

    try {
        const rightIds = rights.map(right => right.id);
        const response = yield call(getLinkedToOriginalRightsV2, rightIds);
        closeModal();
        const rightsWithDeps = {};
        const rightsWithoutDeps = [];
        rights.forEach(right => {
            const foundDependencies = response.filter(
                dep =>
                    !rightIds.includes(dep.id) &&
                    (dep.sourceRightId === right.id || dep.originalRightIds.includes(right.id))
            );
            if (foundDependencies.length) {
                rightsWithDeps[right.id] = {
                    original: right,
                    dependencies: [...foundDependencies],
                    isSelected: true,
                };
            } else {
                rightsWithoutDeps.push(right);
            }
        });
        // rights that have no deps are immediately deleted
        if (rightsWithoutDeps.length) {
            // if rights have dependencies which are also marked for deletion in same bulk
            // separate affected rights and send them as a second param
            // otherwise send them as first param
            const selectedRightIds = [];
            const affectedRightIds = [];
            rightsWithoutDeps.forEach(right => {
                if (right.sourceRightId || right.originalRightIds.length) {
                    affectedRightIds.push(right.id);
                } else {
                    selectedRightIds.push(right.id);
                }
            });
            const preparedParam1 = selectedRightIds.length ? selectedRightIds : affectedRightIds;
            const preparedParam2 = !selectedRightIds.length ? [] : affectedRightIds;
            yield call(bulkDeleteRights, preparedParam1, preparedParam2);
            yield put({
                type: ADD_TOAST,
                payload: {
                    severity: SUCCESS_ICON,
                    detail: `${rightsWithoutDeps.length} ${
                        rightsWithoutDeps.length === 1 ? 'Right' : 'Rights'
                    } deleted`,
                },
            });
        }
        if (Object.keys(rightsWithDeps).length) {
            yield put({
                type: actionTypes.SET_LINKED_TO_ORIGINAL_RIGHTS,
                payload: {rightsWithDeps, deletedRightsCount: rightsWithoutDeps.length},
            });
        }
    } catch (error) {
        closeModal();
        yield put({
            type: actionTypes.GET_LINKED_TO_ORIGINAL_RIGHTS_ERROR,
            payload: error,
            error: true,
        });
    } finally {
        toggleRefreshGridData(true);
    }
}

export function* bulkDeleteSelectedRights({payload}) {
    const {selectedRightIds, impactedRightIds, closeModal, toggleRefreshGridData} = payload || {};

    try {
        yield call(bulkDeleteRights, selectedRightIds, impactedRightIds);
        const count = selectedRightIds.length + impactedRightIds.length;
        yield put({
            type: ADD_TOAST,
            payload: {
                severity: SUCCESS_ICON,
                detail: `${count} ${count === 1 ? 'Right' : 'Rights'} deleted`,
            },
        });
    } catch (error) {
        yield put({
            type: actionTypes.BULK_DELETE_SELECTED_RIGHTS_ERROR,
            payload: error,
            error: true,
        });
    } finally {
        yield put({
            type: actionTypes.CLEAR_LINKED_TO_ORIGINAL_RIGHTS,
            payload: {},
        });
        closeModal();
        toggleRefreshGridData(true);
    }
}

export function* getRight({payload}) {
    if (!payload.id) {
        return;
    }

    try {
        yield put({
            type: actionTypes.GET_RIGHT_REQUEST,
            payload: {},
        });

        const response = yield rightsService.get(payload.id, {});
        yield put({
            type: actionTypes.GET_RIGHT_SUCCESS,
            payload: response,
        });
    } catch (error) {
        yield put({
            type: actionTypes.GET_RIGHT_ERROR,
            payload: error,
        });

        history.push(`${getAuthConfig().realm}/avails`);
    }
}

export function* updateRight({payload}) {
    if (!payload.id) {
        return;
    }

    try {
        yield put({
            type: actionTypes.SAVING,
            payload: true,
        });
        const response = yield rightsService.updateRightWithFullData(payload, payload.id, true);
        yield put({
            type: actionTypes.UPDATE_RIGHT_SUCCESS,
            payload: response,
        });
        yield put({
            type: actionTypes.SAVING,
            payload: false,
        });
        yield put({
            type: actionTypes.EDITING,
            payload: false,
        });
        yield put({
            type: ADD_TOAST,
            payload: {
                severity: SUCCESS_ICON,
                detail: UPDATE_RIGHT_SUCCESS_MESSAGE,
            },
        });
    } catch (error) {
        yield put({
            type: actionTypes.UPDATE_RIGHT_ERROR,
            payload: error,
        });
        yield put({
            type: actionTypes.SAVING,
            payload: false,
        });
        yield put({
            type: ADD_TOAST,
            payload: {
                severity: ERROR_ICON,
                detail: `${UPDATE_RIGHT_FAILED} Detail: ${error.message.message.slice(0, MAX_CHARS)}...`,
            },
        });
    } finally {
        yield put({
            type: actionTypes.GET_RIGHT,
            payload,
        });
    }
}

export function* rightsWatcher() {
    yield all([
        takeEvery(actionTypes.GET_RIGHT, getRight),
        takeEvery(actionTypes.UPDATE_RIGHT, updateRight),
        takeEvery(actionTypes.ADD_RIGHTS_FILTER, storeRightsFilter),
        takeEvery(actionTypes.GET_LINKED_TO_ORIGINAL_RIGHTS, fetchLinkedToOriginalRights),
        takeEvery(actionTypes.BULK_DELETE_SELECTED_RIGHTS, bulkDeleteSelectedRights),
        takeEvery(POST_RESYNC_RIGHTS, resyncUpdate),
    ]);
}
