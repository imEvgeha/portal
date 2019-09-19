import {
    DOP_UPDATE_FILTER_SELECTED_TERRITORIES,
    DOP_UPDATE_PROMOTED_RIGHTS,
    DOP_UPDATE_SELECTED_TERRITORIES, DOP_UPDATE_USE_SELECTED_TERRITORIES,
    LOAD_DOP_SESSION
} from '../../../constants/action-types';

export const loadDopSession = state => ({type: LOAD_DOP_SESSION, payload: state});

export const updatePromotedRights = results => ({ type: DOP_UPDATE_PROMOTED_RIGHTS, payload: results });
export const updateSelectedTerritories = results => ({ type: DOP_UPDATE_SELECTED_TERRITORIES, payload: results });
export const updateUseSelectedTerritories = results => ({ type: DOP_UPDATE_USE_SELECTED_TERRITORIES, payload: results });
export const updateFilterSelectedTerritories = result => ({ type: DOP_UPDATE_FILTER_SELECTED_TERRITORIES, payload: result});