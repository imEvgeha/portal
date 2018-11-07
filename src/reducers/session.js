import {
    LOAD_SESSION,
    SET_REPORT_NAME,
    DASHBOARD_RESULT_PAGE__SELECT_ROW,
} from '../constants/action-types';
import {saveState} from '../stores';

const initialState = {
    availTabPageSelected: [],
    reportName: ''
};

const session = ( state = initialState, action) => {
    switch (action.type) {
        case LOAD_SESSION:
            return { ...state, ...action.payload};
        case SET_REPORT_NAME:
            return { ...state, reportName: action.payload};
        case DASHBOARD_RESULT_PAGE__SELECT_ROW:
            saveState();
            return { ...state, availTabPageSelected: action.payload};
    default:
        return state;
    }
};

export default session;