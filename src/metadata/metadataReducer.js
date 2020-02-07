import * as actionTypes from './metadataActionTypes';

const initialState = {
    titles: {},
    titleId: null,
};

const metadataReducer = (state = initialState, action) => {
    const {type, payload} = action;
    switch (type) {
        case actionTypes.STORE_TITLE:
            return {
                ...state,
                titles: {...state.titles, ...payload},
                titleId: Object.values(payload)[0].id,
            };
        case actionTypes.TITLES_RECONCILE_SUCCESS:
            return {
                ...state,
                titles: {...state.titles, ...payload},
            };
        default:
            return state;
    }
};

export default metadataReducer;
