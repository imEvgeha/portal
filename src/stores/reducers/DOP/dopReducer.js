import {
    DOP_UPDATE_FILTER_SELECTED_TERRITORIES,
    DOP_UPDATE_PROMOTED_RIGHTS, DOP_UPDATE_SELECTED_TERRITORIES, DOP_UPDATE_USE_SELECTED_TERRITORIES, LOAD_DOP_SESSION
} from '../../../constants/action-types';
import {saveDopState} from '../../index';

const initialState = {
    session: {
        promotedRights: [],
        selectedTerritories: [],
        useSelectedTerritories: true,
        filterSelectedTerritories: {}
    }
};

const dop = ( state = initialState, action) => {
    switch (action.type) {
        case LOAD_DOP_SESSION:
            return { ...state, session: {...state.session, ...action.payload}};
        case DOP_UPDATE_PROMOTED_RIGHTS:
            saveDopState();
            return { ...state, session: {...state.session, promotedRights: action.payload}};
        case DOP_UPDATE_SELECTED_TERRITORIES:
            saveDopState();
            return { ...state, session: {...state.session, selectedTerritories: action.payload}};
        case DOP_UPDATE_USE_SELECTED_TERRITORIES:
            saveDopState();
            return { ...state, session: {...state.session, useSelectedTerritories: action.payload}};
        case DOP_UPDATE_FILTER_SELECTED_TERRITORIES:
            saveDopState();
            return { ...state, session: {...state.session, filterSelectedTerritories: action.payload}}
        default:
            return state;
    }
};

export default dop;