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
import {GET_DOP_TASKS_OWNERS, SET_OWNERS_LIST, ASSIGN_DOP_TASKS} from './dopTasksActionTypes';
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
        const [response, headers] = yield call(service, taskIds, userId);
        const location = headers.get('Location') || headers.get('location') || '';
        const batchJobId = location?.split('/').pop();
        const statusResponse = yield call(DopTasksService.getBatchJobStatus, batchJobId);
        yield put({type: TOGGLE_REFRESH_GRID_DATA, payload: true});
        let toastParams = {};
        switch (statusResponse.status) {
            case jobStatus.SUCCESS: {
                toastParams = {
                    title: SUCCESS_TITLE,
                    icon: SUCCESS_ICON,
                    description: `${taskIds.length} tasks successfully assigned to ${userId}.`,
                };
                break;
            }
            case jobStatus.ERROR: {
                toastParams = {
                    title: ERROR_TITLE,
                    icon: ERROR_ICON,
                    description: `Error in assigning ${taskIds.length} tasks to ${userId}.`,
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
                    title: WARNING_TITLE,
                    icon: WARNING_ICON,
                    description: `${jobDetails.success} tasks assigned successfully to ${userId}.
                    Error in assigning ${jobDetails.error} tasks.`,
                };
                break;
            }
            default:
                toastParams = {
                    title: ERROR_TITLE,
                    icon: ERROR_ICON,
                    description: `Status: ${statusResponse.status}`,
                };
        }
        yield put({
            type: ADD_TOAST,
            payload: {
                ...toastParams,
                isAutoDismiss: true,
            },
        });
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
