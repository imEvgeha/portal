import {SUCCESS_ICON, SUCCESS_TITLE} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants';
import {all, call, put, takeLatest} from 'redux-saga/effects';
import {REPLAY_EVENT_SUCCESS_MESSAGE, REPLICATE_EVENT_SUCCESS_MESSAGE} from '../../ui/toast/constants';
import {ADD_TOAST} from '../../ui/toast/toastActionTypes';
import * as actionTypes from './eventManagementActionTypes';
import {replayEvent as replayEventAPI, replicateEvent as replicateEventAPI} from './eventManagementService';

export function* replayEvent(requestMethod, {payload}) {
    try {
        yield put({
            type: actionTypes.REPLAY_EVENT_REQUEST,
            payload: {},
        });

        yield call(requestMethod, payload);
        yield put({
            type: actionTypes.REPLAY_EVENT_SUCCESS,
            payload: {},
        });

        yield put({
            type: ADD_TOAST,
            payload: {
                title: SUCCESS_TITLE,
                icon: SUCCESS_ICON,
                isAutoDismiss: true,
                description: REPLAY_EVENT_SUCCESS_MESSAGE,
            },
        });
    } catch (error) {
        yield put({
            type: actionTypes.REPLAY_EVENT_ERROR,
            payload: error,
            error: true,
        });
    }
}

export function* replicateEvent(requestMethod, {payload}) {
    try {
        yield put({
            type: actionTypes.REPLICATE_EVENT_REQUEST,
            payload: {},
        });

        yield call(requestMethod, payload);
        yield put({
            type: actionTypes.REPLICATE_EVENT_SUCCESS,
            payload: {},
        });

        yield put({
            type: ADD_TOAST,
            payload: {
                title: SUCCESS_TITLE,
                icon: SUCCESS_ICON,
                isAutoDismiss: true,
                description: REPLICATE_EVENT_SUCCESS_MESSAGE,
            },
        });
    } catch (error) {
        yield put({
            type: actionTypes.REPLICATE_EVENT_ERROR,
            payload: error,
            error: true,
        });
    }
}

export function* eventManagementWatcher() {
    yield all([
        takeLatest(actionTypes.REPLAY_EVENT, replayEvent, replayEventAPI),
        takeLatest(actionTypes.REPLICATE_EVENT, replicateEvent, replicateEventAPI),
    ]);
}
