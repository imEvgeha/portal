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
import {getLinkedToOriginalRights} from '../availsService';
import * as actionTypes from './rightsActionTypes';
import {DEFAULT_PAGE_SIZE} from './constants';

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

export function* storeLinkedToOriginalRights({payload}) {
    const {rights} = payload || {};

    try {
        const rightIds = rights.map(right => right.id);
        const [rightsWithSourceRightId, rightsWithOriginalRightIds] = yield all([
            call(getLinkedToOriginalRights, {sourceRightIdList: rightIds}, DEFAULT_PAGE_SIZE),
            call(getLinkedToOriginalRights, {originalRightIdsList: rightIds}, DEFAULT_PAGE_SIZE),
        ]);
        const mergedDependencies = [...rightsWithSourceRightId.data, ...rightsWithOriginalRightIds.data];
        const dependencyRights = {};
        rights.map(right => {
            const foundDependencies = mergedDependencies.filter(
                dep => dep.sourceRightId === right.id || dep.originalRightIds.includes(right.id)
            );
            if (foundDependencies && foundDependencies.length) {
                dependencyRights[right.id] = {
                    original: right,
                    dependencies: [...foundDependencies],
                    isSelected: true,
                };
            }
            return null;
        });

        yield put({
            type: actionTypes.SET_LINKED_TO_ORIGINAL_RIGHTS,
            payload: dependencyRights,
        });
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
    }
}

export function* rightsWatcher() {
    yield all([
        takeEvery(actionTypes.GET_RIGHT, getRight),
        takeEvery(actionTypes.UPDATE_RIGHT, updateRight),
        takeEvery(actionTypes.ADD_RIGHTS_FILTER, storeRightsFilter),
        takeEvery(actionTypes.GET_LINKED_TO_ORIGINAL_RIGHTS, storeLinkedToOriginalRights),
    ]);
}
