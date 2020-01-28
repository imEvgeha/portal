import * as actionTypes from './metadataActionTypes';

const initialState = {
    titles: {},
    focusedTitle: null,
};

const metadataReducer = (state = inititalState, action) => {
    const {type, payload} = action;
    switch (type) {
        case actionTypes.FETCH_AND_STORE_TITLE_SUCCESS:
            return {
                ...state,
                titles: {...titles, payload},
                focusedTitle: payload.id,
            };
        default:
            return state;
    }
};

export default metadataReducer;
