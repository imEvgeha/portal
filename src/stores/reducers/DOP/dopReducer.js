import {
    DOP_UPDATE_PROMOTED_RIGHTS, LOAD_DOP_SESSION
} from '../../../constants/action-types';
import {saveDopState} from '../../index';

const initialState = {
    session: {
        promotedRights: []
    }
};

const dop = ( state = initialState, action) => {
    switch (action.type) {
        case LOAD_DOP_SESSION:
            return { ...state, session: {...state.session, ...action.payload}};
        case DOP_UPDATE_PROMOTED_RIGHTS:
            saveDopState();
            return { ...state, session: {...state.session, promotedRights: action.payload}};
        default:
            return state;
    }
};

export default dop;