import {
    LOAD_PROFILE_INFO,
} from "../constants/action-types";

const initialState = {
    profileInfo: {},

};

const root = ( state = initialState, action) => {
    switch (action.type) {
        case LOAD_PROFILE_INFO:
            return { ...state, profileInfo: action.payload};
        default:
            return state;
    }
};

export default root;