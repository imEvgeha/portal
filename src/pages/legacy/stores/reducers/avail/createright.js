import {RIGHT__CREATE__FORM_UPDATE, LOAD_CREATERIGHT_SESSION} from '../../../constants/action-types';
import {saveCreateRightState} from '../../index';

const initialState = {
    session: {
        form: {},
    },
};

const createright = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_CREATERIGHT_SESSION:
            return {...state, session: {...state.session, ...action.payload}};
        case RIGHT__CREATE__FORM_UPDATE:
            saveCreateRightState();
            return {...state, session: {...state.session, form: action.payload}};
        default:
            return state;
    }
};

export default createright;
