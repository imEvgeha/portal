import {cloneDeep} from 'lodash';
import * as actionTypes from './rightDetailsActionTypes';

const initialState = {
    selectValues: {},
    areValid: true,
    isSaving: false,
    isEditMode: false,
};

const rightDetailsOptionsReducer = (state = initialState, action = {}) => {
    const {type, payload = {}} = action;

    switch (type) {
        case actionTypes.SAVING:
            return {
                ...state,
                isSaving: payload,
            };
        case "EDITING":
            return {
                ...state,
                isEditMode: payload,
            };
        case actionTypes.FETCH_SELECT_VALUES_REQUEST:
            return {
                ...state,
                areValid: true,
                selectValues: {},
            };
        case actionTypes.FETCH_SELECT_VALUES_SUCCESS:
            return {
                ...state,
                areValid: state.areValid,
            };
        case actionTypes.FETCH_SELECT_VALUES_ERROR:
            return {
                ...state,
                areValid: false,
            };
        case actionTypes.STORE_SELECT_VALUES:
            return {
                ...state,
                selectValues: cloneDeep(payload),
            };
        default:
            return state;
    }
};

export default rightDetailsOptionsReducer;
