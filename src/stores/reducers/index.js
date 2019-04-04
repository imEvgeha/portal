import {
    BLOCK_UI,
    LOAD_PROFILE_INFO,
    LOAD_AVAILS_MAPPING, LOAD_REPORTS, RIGHTS__LOAD_SELECT_LISTS,
} from '../../constants/action-types';

const initialState = {
    profileInfo: {},
    reports: null,
    availsMapping: null,
    selectValues: {},
    blocking: false
};

const root = ( state = initialState, action) => {
    switch (action.type) {
    case BLOCK_UI:
        return { ...state, blocking: action.payload};
    case LOAD_PROFILE_INFO:
        return { ...state, profileInfo: action.payload};
    case LOAD_REPORTS:
        return { ...state, reports: action.payload};
    case LOAD_AVAILS_MAPPING:
        return { ...state, availsMapping: action.payload};
    case RIGHTS__LOAD_SELECT_LISTS:
        return { ...state, selectValues: {...state.selectValues, [action.field]: action.payload}};
    default:
        return state;
    }
};

export default root;