import {put, all, call, takeEvery} from 'redux-saga/effects';
import {
    SUCCESS_ICON,
    SUCCESS_TITLE,
    ERROR_ICON,
    UPDATE_RIGHT_FAILED,
    UPDATE_RIGHT_SUCCESS_MESSAGE,
    MAX_CHARS,
} from '../../../ui/elements/nexus-toast-notification/constants';
import {ADD_TOAST} from '../../../ui/toast/toastActionTypes';
import {rightsService} from '../../legacy/containers/avail/service/RightsService';
import {getLinkedToOriginalRightsV2, bulkDeleteRights} from '../availsService';
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
                    title: SUCCESS_TITLE,
                    icon: SUCCESS_ICON,
                    isAutoDismiss: true,
                    description: `${rightsWithoutDeps.length} ${
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
                title: SUCCESS_TITLE,
                icon: SUCCESS_ICON,
                isAutoDismiss: true,
                description: `${count} ${count === 1 ? 'Right' : 'Rights'} deleted`,
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
    }
}

export function* updateRight({payload}) {
    if (!payload.id) {
        return;
    }

    try {
        const response = yield rightsService.updateRightWithFullData(payload, payload.id, true);
        yield put({
            type: actionTypes.UPDATE_RIGHT_SUCCESS,
            payload: response,
        });
        yield put({
            type: ADD_TOAST,
            payload: {
                title: SUCCESS_TITLE,
                icon: SUCCESS_ICON,
                isAutoDismiss: true,
                description: UPDATE_RIGHT_SUCCESS_MESSAGE,
            },
        });
    } catch (error) {
        yield put({
            type: actionTypes.UPDATE_RIGHT_ERROR,
            payload: error,
        });
        yield put({
            type: ADD_TOAST,
            payload: {
                title: UPDATE_RIGHT_FAILED,
                icon: ERROR_ICON,
                isAutoDismiss: true,
                description: `${error.message.message.slice(0, MAX_CHARS)}...`,
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
    ]);
}
