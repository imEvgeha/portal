import actionTypes from './availsActionTypes';

const initialState = {
    ingests: [],
    totalIngests: 0,
    selectedIngest: null,
};

const availsReducer = (state = initialState, action = {}) => {
    const {type, payload = {}} = action;
    switch(type) {
        case actionTypes.FETCH_INGESTS_SUCCESS:
            return {
                ...state,
                ingests: payload.data,
                totalIngests: payload.total
            };
        case actionTypes.FETCH_NEXT_PAGE_SUCCESS:
            return {
                ...state,
                ingests: state.ingests.concat(payload)
            };
        case actionTypes.UPDATE_SELECTED_INGEST:
            return {
                ...state,
                selectedIngest: payload
            };

        default:
            return state;
    }
};

export default availsReducer;

