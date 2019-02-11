import {
    AVAIL__CREATE__FORM_UPDATE,
    LOAD_CREATEAVAIL_SESSION
} from '../../../constants/action-types';

export const loadCreateAvailSession = state => ({type: LOAD_CREATEAVAIL_SESSION, payload: state});

export const saveCreateAvailForm = form => ({type: AVAIL__CREATE__FORM_UPDATE, payload: form});