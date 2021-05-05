import * as actionTypes from './dopTasksActionTypes';

const initialState = {
    gridState: {},
    tasksOwners: [],
};

const dopTasksReducer = (state = initialState, action = {}) => {
    const {type, payload = {}} = action;
    switch (type) {
        case actionTypes.SET_DOP_TASKS_USER_DEFINED_GRID_STATE: {
            const {gridState = {}} = state;
            return {
                ...state,
                gridState: {...gridState, ...payload},
            };
        }
        case actionTypes.SET_OWNERS_LIST:
            return {
                ...state,
                tasksOwners: payload,
            };
        default:
            return state;
    }
};

export default dopTasksReducer;
