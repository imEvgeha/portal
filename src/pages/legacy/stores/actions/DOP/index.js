import {
    DOP_UPDATE_SELECTED_TERRITORIES_TAB,
    DOP_UPDATE_PROMOTED_RIGHTS,
    DOP_UPDATE_SELECTED_TERRITORIES,
    DOP_UPDATE_USE_SELECTED_TERRITORIES,
    LOAD_DOP_SESSION,
    DOP_UPDATE_PROMOTED_RIGHTS_FULL_DATA,
    DOP_UPDATE_RIGHTS_FILTER,
} from '../../../constants/action-types';

export const loadDopSession = state => ({type: LOAD_DOP_SESSION, payload: state});

export const updatePromotedRights = results => ({type: DOP_UPDATE_PROMOTED_RIGHTS, payload: results});
export const updatePromotedRightsFullData = results => ({type: DOP_UPDATE_PROMOTED_RIGHTS_FULL_DATA, payload: results});
export const updateSelectedTerritories = results => ({type: DOP_UPDATE_SELECTED_TERRITORIES, payload: results});
export const updateUseSelectedTerritories = results => ({type: DOP_UPDATE_USE_SELECTED_TERRITORIES, payload: results});
export const updateSelectedTerritoriesTab = result => ({type: DOP_UPDATE_SELECTED_TERRITORIES_TAB, payload: result});
export const updateRightsFilter = result => ({type: DOP_UPDATE_RIGHTS_FILTER, payload: result});
