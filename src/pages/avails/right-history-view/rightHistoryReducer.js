import {FETCH_RIGHT_HISTORY_SUCCESS} from './rightHistoryActionTypes';

const initState = {
    rightIds: [],
    rightsEventHistory: [],
};

const rightHistoryReducer = (state = initState, action) => {
    const {type, payload = {}} = action || {};
    const {rightsEventHistory, rightIds} = payload || [];

    switch (type) {
        case FETCH_RIGHT_HISTORY_SUCCESS:
            return {
                ...state, rightsEventHistory, rightIds,
            };
        default:
            return state;
    }
};

export default rightHistoryReducer;
