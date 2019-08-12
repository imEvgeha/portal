import {
    DOP_UPDATE_PROMOTED_RIGHTS
} from '../../../constants/action-types';

const initialState = {
    promotedRights: []
};

const dop = ( state = initialState, action) => {
    switch (action.type) {
        case DOP_UPDATE_PROMOTED_RIGHTS:
            return { ...state, promotedRights: action.payload};
        default:
            return state;
    }
};

export default dop;