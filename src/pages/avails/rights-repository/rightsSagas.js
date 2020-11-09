import {put, all, call, takeEvery} from 'redux-saga/effects';
import {SUCCESS_ICON, SUCCESS_TITLE} from '../../../ui/elements/nexus-toast-notification/constants';
import {ADD_TOAST} from '../../../ui/toast/toastActionTypes';
import {rightsService} from '../../legacy/containers/avail/service/RightsService';
import {getLinkedToOriginalRightsV2, bulkDeleteRights} from '../availsService';
import rightMatchingReducer from '../right-matching/rightMatchingReducer';
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
    const {rights, closeModal} = payload || {};

    try {
        const rightIds = rights.map(right => right.id);
        const response = yield call(getLinkedToOriginalRightsV2, rightIds);
        closeModal();
        const rightsWithDeps = {};
        const rightIdsWithoutDeps = [];
        rights.forEach(right => {
            const foundDependencies = response.filter(
                dep => dep.sourceRightId === right.id || dep.originalRightIds.includes(right.id)
            );
            if (foundDependencies.length) {
                rightsWithDeps[right.id] = {
                    original: right,
                    dependencies: [...foundDependencies],
                    isSelected: true,
                };
            } else {
                rightIdsWithoutDeps.push(right.id);
            }
        });
        if (rightIdsWithoutDeps.length) {
            // yield call(bulkDeleteRights, rightIdsWithoutDeps);
            yield put({
                type: ADD_TOAST,
                payload: {
                    title: SUCCESS_TITLE,
                    icon: SUCCESS_ICON,
                    isAutoDismiss: true,
                    description: `${rightIdsWithoutDeps.length} ${
                        rightIdsWithoutDeps.length === 1 ? 'Right' : 'Rights'
                    } deleted`,
                },
            });
        }
        if (Object.keys(rightsWithDeps).length) {
            yield put({
                type: actionTypes.SET_LINKED_TO_ORIGINAL_RIGHTS,
                payload: {rightsWithDeps, deletedRightsCount: rightIdsWithoutDeps.length},
            });
        }
    } catch (error) {
        yield put({
            type: actionTypes.GET_LINKED_TO_ORIGINAL_RIGHTS_ERROR,
            payload: error,
            error: true,
        });
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
        const response = yield rightsService.updateRightWithFullData(payload, payload.id);
        yield put({
            type: actionTypes.UPDATE_RIGHT_SUCCESS,
            payload: response,
        });
    } catch (error) {
        yield put({
            type: actionTypes.UPDATE_RIGHT_ERROR,
            payload: error,
        });
    }
}

export function* rightsWatcher() {
    yield all([
        takeEvery(actionTypes.GET_RIGHT, getRight),
        takeEvery(actionTypes.UPDATE_RIGHT, updateRight),
        takeEvery(actionTypes.ADD_RIGHTS_FILTER, storeRightsFilter),
        takeEvery(actionTypes.GET_LINKED_TO_ORIGINAL_RIGHTS, fetchLinkedToOriginalRights),
    ]);
}
