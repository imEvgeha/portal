import {
    METADATA_TITLE_LOAD_PROFILE_INFO,
    METADATA_TITLE_LOAD_REPORTS,
    METADATA_TITLE_UPDATE_BREADCRUMB,
    METADATA_TITLE_LOAD_AVAILS_MAPPING,
} from '../../../constants/action-types';

const initialState = {
    profileInfo: {},
    reports: null,
    breadcrumb: [],
};

const root = (state = initialState, action) => {
    switch (action.type) {
        case METADATA_TITLE_LOAD_PROFILE_INFO:
            return {...state, profileInfo: action.payload};
        case METADATA_TITLE_LOAD_REPORTS:
            return {...state, reports: action.payload};
        case METADATA_TITLE_LOAD_AVAILS_MAPPING:
            return {...state, availsMapping: action.payload};
        case METADATA_TITLE_UPDATE_BREADCRUMB:
            return {...state, breadcrumb: action.payload};
        default:
            return state;
    }
};

export default root;
