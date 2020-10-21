import * as actionTypes from './dopTasksActionTypes';

const initialState = {
    filterModel: {},
};

const dopTasksReducer = (state = initialState, action = {}) => {
    const {type, payload = {}} = action;
    switch (type) {
        case actionTypes.SET_DOP_TASKS_USER_FILTER: {
            const {filterModel = {}} = state;
            return {
                ...state,
                filterModel: {...filterModel, ...payload},
            };
        }
        default:
            return state;
    }
};

export default dopTasksReducer;
