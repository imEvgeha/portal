import {
    CREATEAVAIL_FORM__UPDATE, LOAD_CREATEAVAIL_SESSION, LOAD_DASHBOARD_SESSION
} from '../../../constants/action-types';
import {saveCreateAvailState} from "../../index";

const initialState = {
    session:{
        form: {}
    }
};

const createavail = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_CREATEAVAIL_SESSION:
            return { ...state, session: {...state.session, ...action.payload}};
        case CREATEAVAIL_FORM__UPDATE:
            saveCreateAvailState();
            return {...state, session: {...state.session, form: action.payload}};
        default:
            return state;
    }
};

export default createavail;