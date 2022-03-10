import {
    SAVE_STATUS_DATA,
    REMOVE_STATUS_DATA,
    STORE_RESYNC_RIGHTS,
    STORE_SELECTED_RESYNC_RIGHTS,
} from './statusLogActionTypes';

const initialState = {
    count: 0,
    data: [],
    resyncRights: {},
    selectedResyncRights: [],
};

const statusLogReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_STATUS_DATA: {
            return {
                ...state,
                count: action.payload.total,
                data: action.payload.data,
            };
        }

        case REMOVE_STATUS_DATA: {
            return {
                ...state,
                count: 0,
                data: [],
            };
        }

        case STORE_RESYNC_RIGHTS: {
            return {
                ...state,
                resyncRights: action.payload,
            };
        }

        default:
            return state;
    }
};

export default statusLogReducer;
