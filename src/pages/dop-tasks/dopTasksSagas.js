import {
    SUCCESS_ICON,
    SUCCESS_TITLE,
    ERROR_ICON,
    ERROR_TITLE,
    WARNING_ICON,
    WARNING_TITLE,
} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-toast-notification/constants';
import {TOGGLE_REFRESH_GRID_DATA} from '@vubiquity-nexus/portal-ui/lib/grid/gridActionTypes';
import {ADD_TOAST} from '@vubiquity-nexus/portal-ui/lib/toast/toastActionTypes';
import {uniqBy} from 'lodash';
import {call, put, all, takeLatest} from 'redux-saga/effects';
import DopTasksService from './dopTasks-services';
import {
    GET_DOP_TASKS_OWNERS,
    SET_OWNERS_LIST,
    ASSIGN_DOP_TASKS,
    CHANGE_PRIORITY,
    UNASSIGN_DOP_TASKS,
} from './dopTasksActionTypes';
import {jobStatus, TASK_ACTIONS_ASSIGN} from './constants';

function* fetchOwners({payload}) {
    try {
        const response = yield call(DopTasksService.getOwners, payload.join(','));
        let owners = [];
        if (payload.length) {
            response.forEach(d => {
                owners = owners.concat(d.potentialOwner.groupMember);
            });
            owners = uniqBy(owners, 'userId').map(({firstName, lastName, userId}) => ({
                label: `${firstName} ${lastName} (${userId})`,
                value: userId,
            }));
        } else {
            owners = response.map(user => ({
                label: user.potentialOwner.groupName,
                value: user.potentialOwner.groupName,
            }));
        }
        yield put({
            type: SET_OWNERS_LIST,
            payload: owners,
        });
    } catch (error) {
        yield put({
            type: SET_OWNERS_LIST,
            payload: [],
        });
    }
}

function* assignTasks({payload}) {
    const {userId, taskIds, closeModal, action = TASK_ACTIONS_ASSIGN} = payload;
    try {
        const service = action === TASK_ACTIONS_ASSIGN ? DopTasksService.assignTask : DopTasksService.forwardTask;
        // eslint-disable-next-line no-unused-vars
        const [response, headers] = yield call(service, taskIds, userId);
        const location = headers.get('Location') || headers.get('location') || '';
        const batchJobId = location?.split('/').pop();
        const statusResponse = yield call(DopTasksService.getBatchJobStatus, batchJobId);
        yield put({type: TOGGLE_REFRESH_GRID_DATA, payload: true});
        let toastParams = {};
        switch (statusResponse.status) {
            case jobStatus.IN_PROGRESS: {
                toastParams = {
                    summary: SUCCESS_TITLE,
                    severity: SUCCESS_ICON,
                    detail: 'Request still in process, please refresh the data in a short while.',
                };
                break;
            }
            case jobStatus.SUCCESS: {
                toastParams = {
                    summary: SUCCESS_TITLE,
                    severity: SUCCESS_ICON,
                    detail: `${taskIds.length} tasks successfully ${action.toLowerCase()}ed to ${userId}.`,
                };
                break;
            }
            case jobStatus.ERROR: {
                toastParams = {
                    summary: ERROR_TITLE,
                    severity: ERROR_ICON,
                    sticky: true,
                    detail: `Error in ${action.toLowerCase()}ing ${taskIds.length} tasks to ${userId}.`,
                };
                break;
            }
            case jobStatus.PARTIAL: {
                const jobDetails = statusResponse.itemStatus.reduce(
                    (acc, item) => {
                        item.status === jobStatus.SUCCESS ? acc.success++ : acc.error++;
                        return acc;
                    },
                    {success: 0, error: 0}
                );
                toastParams = {
                    summary: WARNING_TITLE,
                    severity: WARNING_ICON,
                    sticky: true,
                    detail: `${jobDetails.success} tasks ${action.toLowerCase()}ed successfully to ${userId}.
                    Error in ${action.toLowerCase()}ing ${jobDetails.error} tasks.`,
                };
                break;
            }
            default:
                toastParams = {
                    summary: ERROR_TITLE,
                    severity: ERROR_ICON,
                    sticky: true,
                    detail: `Status: ${statusResponse.status}`,
                };
        }
        yield put({
            type: ADD_TOAST,
            payload: {
                ...toastParams,
            },
        });
    } catch (error) {
        yield put({
            type: ADD_TOAST,
            payload: {
                summary: ERROR_TITLE,
                severity: ERROR_ICON,
                sticky: true,
                detail: `Error in ${action.toLowerCase()}ing ${taskIds.length} tasks to ${userId}.`,
            },
        });
    } finally {
        closeModal();
    }
}

function* unAssignTasks({payload}) {
    const {taskIds} = payload;
    try {
        yield call(DopTasksService.unAssignTask, taskIds);
        yield put({type: TOGGLE_REFRESH_GRID_DATA, payload: true});
        yield put({
            type: ADD_TOAST,
            payload: {
                summary: SUCCESS_TITLE,
                severity: SUCCESS_ICON,
                detail: `${taskIds.length} tasks successfully un-assigned`,
            },
        });
    } catch (error) {
        yield put({
            type: ADD_TOAST,
            payload: {
                summary: ERROR_TITLE,
                severity: ERROR_ICON,
                sticky: true,
                detail: `Error in un-assigning ${taskIds.length} tasks.`,
            },
        });
    }
}

function* changeDOPPriority({payload}) {
    const {taskIds, priority} = payload;
    try {
        yield call(
            DopTasksService.changePriority,
            taskIds.map(n => n.projectId),
            priority
        );
        yield put({type: TOGGLE_REFRESH_GRID_DATA, payload: true});
        yield put({
            type: ADD_TOAST,
            payload: {
                summary: SUCCESS_TITLE,
                severity: SUCCESS_ICON,
                detail: `Changed priority of ${taskIds.length} tasks to ${priority}.`,
            },
        });
    } catch (error) {
        yield put({
            type: ADD_TOAST,
            payload: {
                summary: ERROR_TITLE,
                severity: ERROR_ICON,
                sticky: true,
                detail: `Error in changing priority of ${taskIds.length} tasks.`,
            },
        });
    }
}

export default function* dopTasksWatcher() {
    yield all([takeLatest(GET_DOP_TASKS_OWNERS, fetchOwners)]);
    yield all([takeLatest(ASSIGN_DOP_TASKS, assignTasks)]);
    yield all([takeLatest(UNASSIGN_DOP_TASKS, unAssignTasks)]);
    yield all([takeLatest(CHANGE_PRIORITY, changeDOPPriority)]);
}
