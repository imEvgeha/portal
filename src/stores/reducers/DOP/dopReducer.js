import {
    DOP_UPDATE_SELECTED_TERRITORIES_TAB,
    DOP_UPDATE_PROMOTED_RIGHTS,
    DOP_UPDATE_SELECTED_TERRITORIES,
    DOP_UPDATE_USE_SELECTED_TERRITORIES,
    LOAD_DOP_SESSION,
    DOP_UPDATE_PROMOTED_RIGHTS_FULL_DATA
} from '../../../constants/action-types';
import {saveDopState} from '../../index';
import {ALL_RIGHTS} from '../../../constants/DOP/selectedTab';

const initialState = {
    session: {
        promotedRights: [],
        promotedRightsFullData: [],
        selectedTerritories: [],
        useSelectedTerritories: true,
        selectedTerritoriesTab: ALL_RIGHTS
    }
};

const dop = ( state = initialState, action) => {
    switch (action.type) {
        case LOAD_DOP_SESSION:
            return { ...state, session: {...state.session, ...action.payload}};
        case DOP_UPDATE_PROMOTED_RIGHTS:
            saveDopState();
            return { ...state, session: {...state.session, promotedRights: action.payload}};
        case DOP_UPDATE_PROMOTED_RIGHTS_FULL_DATA:
            saveDopState();
            return { ...state, session: {...state.session, promotedRightsFullData: action.payload}};
        case DOP_UPDATE_SELECTED_TERRITORIES:
            saveDopState();
            return { ...state, session: {...state.session, selectedTerritories: action.payload}};
        case DOP_UPDATE_USE_SELECTED_TERRITORIES:
            saveDopState();
            return { ...state, session: {...state.session, useSelectedTerritories: action.payload}};
        case DOP_UPDATE_SELECTED_TERRITORIES_TAB:
            saveDopState();
            return { ...state, session: {...state.session, selectedTerritoriesTab: action.payload}};
        default:
            return state;
    }
};

export default dop;