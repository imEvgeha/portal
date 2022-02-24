import {SAVE_STATUS_DATA, REMOVE_STATUS_DATA} from './statusLogActionTypes';

const initialState = {
    count: 0,
    data: [],
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

        default:
            return state;
    }
};

export default statusLogReducer;
