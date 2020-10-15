import {
    BLOCK_UI,
    LOAD_PROFILE_INFO,
    LOAD_AVAILS_MAPPING,
    LOAD_REPORTS,
    RIGHTS__LOAD_SELECT_LISTS,
    UPDATE_COLUMNS_SIZE,
} from '../../constants/action-types';

import {
    STORE_AVAIL_MAPPING,
    STORE_AVAIL_SELECT_LIST,
    STORE_AVAIL_CONFIGURATION_REPORTS,
} from '../../containers/avail/availActionTypes';

import {STORE_MAPPING} from './actionTypes';

const initialState = {
    profileInfo: {},
    reports: null,
    availsMapping: null,
    selectValues: {},
    blocking: false,
    mapping: {
        avail: [],
        title: [],
    },
    columnsSize: {},
};

const updateMapping = (state, payload) => {
    const type = Object.keys(payload)[0];
    return {...state, [type]: Object.values(payload)[0]};
};

const root = (state = initialState, action) => {
    switch (action.type) {
        case BLOCK_UI:
            return {...state, blocking: action.payload};
        case LOAD_PROFILE_INFO:
            return {...state, profileInfo: action.payload};
        case LOAD_REPORTS:
            return {...state, reports: action.payload};
        case LOAD_AVAILS_MAPPING:
            return {...state, availsMapping: action.payload};
        case RIGHTS__LOAD_SELECT_LISTS:
            return {...state, selectValues: {...state.selectValues, [action.field]: action.payload}};

        case STORE_AVAIL_MAPPING:
            return {...state, availsMapping: action.payload};
        case STORE_AVAIL_SELECT_LIST:
            return {...state, selectValues: action.payload};
        case STORE_AVAIL_CONFIGURATION_REPORTS:
            return {...state, reports: action.payload};

        case STORE_MAPPING:
            return {...state, mapping: updateMapping(state.mapping, action.payload)};

        case UPDATE_COLUMNS_SIZE:
            return {...state, columnsSize: {...state.columnsSize, [action.gridId]: action.payload}};

        default:
            return state;
    }
};

export default root;
