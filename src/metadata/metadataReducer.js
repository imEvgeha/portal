import * as actionTypes from './metadataActionTypes';

const initialState = {
    titles: {},
    page: null,
    size: 100,
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
        case actionTypes.STORE_TITLES:
            return {
                ...state,
                titles: {...state.titles, ...payload.data},
                page: payload.page,
                size: payload.size,
            };
        default:
            return state;
    }
};

export default metadataReducer;
