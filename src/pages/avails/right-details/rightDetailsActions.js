import * as actionTypes from './rightDetailsActionTypes';

export const getSelectValues = () => ({
    type: actionTypes.GET_SELECT_VALUES,
});

export const isCrewEditable = payload => ({
    type: actionTypes.IS_CREW_EDITABLE,
    payload,
});
