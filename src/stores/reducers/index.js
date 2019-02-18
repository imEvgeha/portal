import {
    LOAD_PROFILE_INFO,
    LOAD_AVAILS_MAPPING, LOAD_REPORTS,
} from '../../constants/action-types';

const initialState = {
    profileInfo: {},
    reports: null,
    availsMapping: null
};

const root = ( state = initialState, action) => {
    switch (action.type) {
    case LOAD_PROFILE_INFO:
        return { ...state, profileInfo: action.payload};
    case LOAD_REPORTS:
        return { ...state, reports: action.payload};
    case LOAD_AVAILS_MAPPING:
        return { ...state, availsMapping: action.payload};
    default:
        return state;
    }
};

export default root;