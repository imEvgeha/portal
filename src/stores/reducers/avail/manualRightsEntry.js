import {TOTAL_RIGHTS} from '../../../constants/avails/manualRightsEntryTabs';
import {
    LOAD_MANUAL_RIGHT_ENTRY_SESSION,
    MANUAL_RIGHT_ENTRY__SET_SELECTED_TAB,
    MANUAL_RIGHT_ENTRY__UPDATE_COLUMNS
} from '../../../constants/action-types';
import {saveManualRightEntryState} from '../../index';

const initialState = {
    session:{
        selectedTab: TOTAL_RIGHTS,
        columns: ['title', 'productionStudio', 'territory', 'genres', 'start', 'end']
    }
};

const manualRightsEntry = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_MANUAL_RIGHT_ENTRY_SESSION:
            return { ...state, session: {...state.session, ...action.payload}};
        case MANUAL_RIGHT_ENTRY__SET_SELECTED_TAB:
            saveManualRightEntryState();
            return {...state, session: {...state.session, selectedTab: action.payload}};
        case MANUAL_RIGHT_ENTRY__UPDATE_COLUMNS:
            saveManualRightEntryState();
            return {...state, session: {...state.session, columns: action.payload}};
        default:
            return state;
    }
};

export default manualRightsEntry;