import {
    DOP_UPDATE_PROMOTED_RIGHTS,
    DOP_UPDATE_PROMOTED_RIGHTS_FULL_DATA,
    DOP_UPDATE_RIGHTS_FILTER,
    DOP_UPDATE_SELECTED_TERRITORIES,
    DOP_UPDATE_SELECTED_TERRITORIES_TAB,
    DOP_UPDATE_USE_SELECTED_TERRITORIES,
    LOAD_DOP_SESSION,
} from '../../../constants/action-types';
import {saveDopState} from '../../index';
import {ALL_RIGHTS, INCOMING, SELECTED} from '../../../constants/DOP/selectedTab';
import {initialTabFilter} from '../../../constants/DOP/tabFilter';

const initialState = {
    session: {
        promotedRights: [],
        promotedRightsFullData: [],
        selectedTerritories: [],
        useSelectedTerritories: true,
        selectedTerritoriesTab: ALL_RIGHTS,
        tabFilter: initialTabFilter,
    },
};

const dop = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_DOP_SESSION:
            return {...state, session: {...state.session, ...action.payload}};
        case DOP_UPDATE_PROMOTED_RIGHTS:
            saveDopState();
            return {...state, session: {...state.session, promotedRights: action.payload}};
        case DOP_UPDATE_PROMOTED_RIGHTS_FULL_DATA:
            saveDopState();
            return {...state, session: {...state.session, promotedRightsFullData: action.payload}};
        case DOP_UPDATE_SELECTED_TERRITORIES:
            saveDopState();
            return {...state, session: {...state.session, selectedTerritories: action.payload}};
        case DOP_UPDATE_USE_SELECTED_TERRITORIES:
            saveDopState();
            return {...state, session: {...state.session, useSelectedTerritories: action.payload}};
        case DOP_UPDATE_SELECTED_TERRITORIES_TAB:
            saveDopState();
            return {...state, session: {...state.session, selectedTerritoriesTab: action.payload}};
        case DOP_UPDATE_RIGHTS_FILTER:
            return {...state, session: {...state.session, tabFilter: action.payload}};
        default:
            return state;
    }
};

export default dop;
