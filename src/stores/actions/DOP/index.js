import {DOP_UPDATE_PROMOTED_RIGHTS, LOAD_DOP_SESSION} from '../../../constants/action-types';

export const loadDopSession = state => ({type: LOAD_DOP_SESSION, payload: state});

export const updatePromotedRights = results => ({ type: DOP_UPDATE_PROMOTED_RIGHTS, payload: results });