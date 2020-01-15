import * as actionTypes from './rightsActionTypes';

const initialState = {
    list: {},
    total: 0,
    selected: {},
    filter: {
        column: {},
        external: {},
    },
};

const rightsReducer = (state = initialState, action = {}) => {
    const {type, payload = {}} = action;

    switch (type) {
        case actionTypes.SET_SELECTED_RIGHTS:
            return {
                ...state,
                selected: payload,
            };
        case actionTypes.STORE_RIGHTS_FILTER_SUCCESS:
            const {external, column} = state.filter;
            if (payload.external) {
                return {
                    ...state,
                    filter: {
                        column,
                        external: {...external, ...payload.external}
                    },
                };
            }
            return {
                ...state,
                filter: {
                    column: {...column, ...payload.column},
                    external,
                },
            };
        default:
            return state;
    }
};

export default rightsReducer;
