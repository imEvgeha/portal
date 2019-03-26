import {
    LOAD_PROFILE_INFO,
    LOAD_AVAILS_MAPPING,
    LOAD_SESSION,
    LOAD_REPORTS,
    SET_REPORT_NAME,
    RIGHTS__LOAD_SELECT_LISTS
} from '../../constants/action-types';

export const loadProfileInfo = profileInfo => ({type: LOAD_PROFILE_INFO, payload: profileInfo});
export const loadAvailsMapping = availsMapping => ({type: LOAD_AVAILS_MAPPING, payload: availsMapping});
export const loadSelectLists = (field, list) => ({type: RIGHTS__LOAD_SELECT_LISTS, field:field, payload: list});
export const loadSession = state => ({type: LOAD_SESSION, payload: state});
export const loadReports = reports => ({type: LOAD_REPORTS, payload: reports});
export const setReportName = reportName => ({type: SET_REPORT_NAME, payload: reportName});
