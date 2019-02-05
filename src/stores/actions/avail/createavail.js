import {
    CREATEAVAIL_FORM__UPDATE,
    LOAD_CREATEAVAIL_SESSION
} from '../../../constants/action-types';

export const loadCreateAvailSession = state => ({type: LOAD_CREATEAVAIL_SESSION, payload: state});

export const saveCreateAvailForm = form => ({type: CREATEAVAIL_FORM__UPDATE, payload: form});