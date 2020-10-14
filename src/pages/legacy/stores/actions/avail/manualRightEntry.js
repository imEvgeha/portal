import {
    LOAD_MANUAL_RIGHT_ENTRY_SESSION,
    MANUAL_RIGHT_ENTRY__LOADING,
    MANUAL_RIGHT_ENTRY__SELECT_ROW,
    MANUAL_RIGHT_ENTRY__SET_SELECTED_TAB,
    MANUAL_RIGHT_ENTRY__SORT,
    MANUAL_RIGHT_ENTRY__UPDATE,
    MANUAL_RIGHT_ENTRY__UPDATE_COLUMNS,
} from '../../../constants/action-types';

export const loadManualRightEntrySession = state => ({type: LOAD_MANUAL_RIGHT_ENTRY_SESSION, payload: state});

export const updateManualRightEntrySelectedTab = tab => ({type: MANUAL_RIGHT_ENTRY__SET_SELECTED_TAB, payload: tab});
export const updateManualRightsEntryColumns = columns => ({type: MANUAL_RIGHT_ENTRY__UPDATE_COLUMNS, payload: columns});

export const manualRightsResultPageSelect = selection => ({type: MANUAL_RIGHT_ENTRY__SELECT_ROW, payload: selection});
export const manualRightsResultPageUpdate = results => ({type: MANUAL_RIGHT_ENTRY__UPDATE, payload: results});
export const manualRightsResultPageLoading = loading => ({type: MANUAL_RIGHT_ENTRY__LOADING, payload: loading});
export const manualRightsResultPageSort = sortCriteria => ({type: MANUAL_RIGHT_ENTRY__SORT, payload: sortCriteria});
