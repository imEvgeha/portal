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
            return {
                ...state,
                filter: {
                    column: payload.column ? {...column, ...payload.column} : column,
                    external: payload.external ? {...external, ...payload.external} : external,
                },
            };
        // case actionTypes.ADD_RIGHTS_FILTER:
        // case actionTypes.EDIT_RIGHTS_FILTER:

        case actionTypes.REMOVE_RIGHTS_FILTER:
            const updatedColumnFilter = Object.keys(state.filter.column)
                .filter(key => key !== payload)
                .reduce((o, key) => (o[key] = state.filter.column[key]  , o), {});
            const updatedExternalFilter = Object.keys(state.filter.external)
                .filter(key => key !== payload)
                .reduce((o, key) => (o[key] = state.filter.external[key]  , o), {});
            const updatedFilter = {
                column: updatedColumnFilter,
                external: updatedExternalFilter,
            };

            return {
                ...state,
                filter: updatedFilter
            };
        default:
            return state;
    }
};

export default rightsReducer;
