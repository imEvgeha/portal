import {
    BLOCK_UI,
    LOAD_PROFILE_INFO,
    LOAD_AVAILS_MAPPING,
    LOAD_SESSION,
    LOAD_REPORTS,
    SET_REPORT_NAME,
    RIGHTS__LOAD_SELECT_LISTS,
    UPDATE_COLUMNS_SIZE,
} from '../../constants/action-types';

export const blockUI = block => ({type: BLOCK_UI, payload: block});
export const loadProfileInfo = profileInfo => ({type: LOAD_PROFILE_INFO, payload: profileInfo});
export const loadAvailsMapping = availsMapping => ({type: LOAD_AVAILS_MAPPING, payload: availsMapping});
export const loadSelectLists = (field, list) => ({type: RIGHTS__LOAD_SELECT_LISTS, field: field, payload: list});
export const loadReports = reports => ({type: LOAD_REPORTS, payload: reports});
export const setReportName = reportName => ({type: SET_REPORT_NAME, payload: reportName});
export const setGridColumnsSize = (gridId, columnsSize) => ({type: UPDATE_COLUMNS_SIZE, gridId, payload: columnsSize});
