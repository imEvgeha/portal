import {
    SUCCESS_ICON,
    SUCCESS_TITLE,
    ERROR_ICON,
    ERROR_TITLE,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants';
import {ADD_TOAST} from '@vubiquity-nexus/portal-ui/lib/toast/toastActionTypes';
import {uniqBy} from 'lodash';
import {call, put, all, takeLatest} from 'redux-saga/effects';
import DopTasksService from './dopTasks-services';
import {GET_DOP_TASKS_OWNERS, SET_OWNERS_LIST, ASSIGN_DOP_TASKS} from './dopTasksActionTypes';

function* fetchOwners({payload}) {
    try {
        const response = yield call(DopTasksService.getOwners, payload.join(','));
        let owners = [];
        response.forEach(d => {
            owners = owners.concat(d.potentialOwner.groupMember);
        });
        yield put({
            type: SET_OWNERS_LIST,
            payload: uniqBy(owners, 'userId'),
        });
    } catch (error) {
        yield put({
            type: SET_OWNERS_LIST,
            payload: [],
        });
    }
}

function* assignTasks({payload}) {
    const {userId, taskIds, closeModal} = payload;
    try {
        const [response, headers] = yield call(DopTasksService.assignTask, taskIds, userId);
        const batchJobId = headers.get('Location')?.split('/').pop();
        const statusResponse = yield call(DopTasksService.getBatchJobStatus, batchJobId);
        if (statusResponse.status === 'COMPLETED') {
            yield put({
                type: ADD_TOAST,
                payload: {
                    title: SUCCESS_TITLE,
                    icon: SUCCESS_ICON,
                    isAutoDismiss: true,
                    description: `${taskIds.length} tasks successfully assigned to ${userId}.`,
                },
            });
        }
    } catch (error) {
        yield put({
            type: ADD_TOAST,
            payload: {
                title: ERROR_TITLE,
                icon: ERROR_ICON,
                isAutoDismiss: true,
                description: `Error in assigning ${taskIds.length} tasks to ${userId}.`,
            },
        });
    } finally {
        closeModal();
    }
}

export default function* dopTasksWatcher() {
    yield all([takeLatest(GET_DOP_TASKS_OWNERS, fetchOwners)]);
    yield all([takeLatest(ASSIGN_DOP_TASKS, assignTasks)]);
}
