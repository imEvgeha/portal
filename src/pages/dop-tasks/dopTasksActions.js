import * as actionTypes from './dopTasksActionTypes';

export const setDopTasksUserDefinedGridState = payload => ({
    type: actionTypes.SET_DOP_TASKS_USER_DEFINED_GRID_STATE,
    payload,
});

export const getDopTasksOwners = payload => ({
    type: actionTypes.GET_DOP_TASKS_OWNERS,
    payload,
});

export const assignDopTasks = payload => ({
    type: actionTypes.ASSIGN_DOP_TASKS,
    payload,
});

export const unAssignDopTasks = payload => ({
    type: actionTypes.UNASSIGN_DOP_TASKS,
    payload,
});

export const changeDOPPriority = payload => ({
    type: actionTypes.CHANGE_PRIORITY,
    payload,
});
