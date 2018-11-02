import {
    LOAD_PROFILE_INFO,
    LOAD_AVAILS_MAPPING,
    LOAD_SESSION,
} from '../constants/action-types';

export const loadProfileInfo = profileInfo => ({type: LOAD_PROFILE_INFO, payload: profileInfo});
export const loadAvailsMapping = availsMapping => ({type: LOAD_AVAILS_MAPPING, payload: availsMapping});
export const loadSession = state => ({type: LOAD_SESSION, payload: state});