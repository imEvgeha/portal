import {
    LOAD_SESSION,
    DASHBOARD_RESULT_PAGE__SELECT_ROW,
} from '../constants/action-types';
import {saveState} from '../stores';

const initialState = {
    availTabPageSelection: {
        selected: [],
        selectAll: false
    },
};

const session = ( state = initialState, action) => {
    switch (action.type) {
        case LOAD_SESSION:
            return { ...state, ...action.payload};
        case DASHBOARD_RESULT_PAGE__SELECT_ROW:
            saveState();
            return { ...state, availTabPageSelection: action.payload};
    default:
        return state;
    }
};

export default session;