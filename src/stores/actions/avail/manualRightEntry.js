import {
    LOAD_MANUAL_RIGHT_ENTRY_SESSION, MANUAL_RIGHT_ENTRY__UPDATE_COLUMNS,
    MANUAL_RIGHT_ENTRY__SET_SELECTED_TAB,
} from '../../../constants/action-types';

export const loadManualRightEntrySession = state => ({type: LOAD_MANUAL_RIGHT_ENTRY_SESSION, payload: state});

export const updateManualRightEntrySelectedTab = tab => ({ type: MANUAL_RIGHT_ENTRY__SET_SELECTED_TAB, payload: tab });
export const updateManualRightsEntryColumns = columns => ({ type: MANUAL_RIGHT_ENTRY__UPDATE_COLUMNS, payload: columns});
