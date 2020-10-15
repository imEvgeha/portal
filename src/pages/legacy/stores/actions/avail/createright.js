import {RIGHT__CREATE__FORM_UPDATE, LOAD_CREATERIGHT_SESSION} from '../../../constants/action-types';

export const loadCreateRightSession = state => ({type: LOAD_CREATERIGHT_SESSION, payload: state});

export const saveCreateRightForm = form => ({type: RIGHT__CREATE__FORM_UPDATE, payload: form});
