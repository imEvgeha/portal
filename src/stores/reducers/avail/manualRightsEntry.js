import {TOTAL_RIGHTS} from '../../../constants/avails/manualRightsEntryTabs';
import {LOAD_MANUAL_RIGHT_ENTRY_SESSION, MANUAL_RIGHT_ENTRY__SET_SELECTED_TAB} from '../../../constants/action-types';
import {saveManualRightEntryState} from '../../index';

const initialState = {
    session:{
        selectedTab: TOTAL_RIGHTS
    }
};

const manualRightsEntry = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_MANUAL_RIGHT_ENTRY_SESSION:
            return { ...state, session: {...state.session, ...action.payload}};
        case MANUAL_RIGHT_ENTRY__SET_SELECTED_TAB:
            saveManualRightEntryState();
            return {...state, session: {...state.session, selectedTab: action.payload}};
        default:
            return state;
    }
};

export default manualRightsEntry;