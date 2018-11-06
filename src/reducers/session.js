import {
    DASHBOARD_RESULT_PAGE__SELECT_ROW,
    LOAD_SESSION,
} from '../constants/action-types';
import {saveState} from '../stores';

const initialState = {
    availTabPageSelected: [],
};

const session = ( state = initialState, action) => {
    switch (action.type) {
        case LOAD_SESSION:
            return { ...state, ...action.payload};
        case DASHBOARD_RESULT_PAGE__SELECT_ROW:
            saveState();
            return { ...state, availTabPageSelected: action.payload};
    default:
        return state;
    }
};

export default session;