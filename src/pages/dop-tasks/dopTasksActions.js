import * as actionTypes from './dopTasksActionTypes';

export const setDopTasksUserDefinedGridState = payload => ({
    type: actionTypes.SET_DOP_TASKS_USER_DEFINED_GRID_STATE,
    payload,
});

export const getDopTasksOwners = payload => ({
    type: actionTypes.GET_DOP_TASKS_OWNERS,
    payload,
});
