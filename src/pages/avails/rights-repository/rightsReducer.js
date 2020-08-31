import * as actionTypes from './rightsActionTypes';

const initialState = {
    list: {},
    total: 0,
    selected: {},
    prePlanRights: {},
    filter: {
        column: {},
        external: {},
    },
};

const filteringObject = (object, criteria) => {
    return Object.keys(object || {})
        .filter(criteria)
        .reduce((o, key) => {
            o[key] = object[key];
            return o;
        }, {});
};

const rightsReducer = (state = initialState, action = {}) => {
    const {type, payload = {}} = action;

    switch (type) {
        case actionTypes.SET_SELECTED_RIGHTS: {
            const {selected = {}} = state;
            return {
                ...state,
                selected: {...selected, ...payload},
            };
        }
        case actionTypes.SET_PREPLAN_RIGHTS: {
            const {prePlanRights = {}} = state;
            return {
                ...state,
                prePlanRights: {...prePlanRights, ...payload},
            };
        }
        case actionTypes.ADD_RIGHTS_FILTER_SUCCESS: {
            const {external, column} = state.filter || {};
            return {
                ...state,
                filter: {
                    column: payload.column ? {...column, ...payload.column} : column,
                    external: payload.external ? {...external, ...payload.external} : external,
                },
            };
        }
        case actionTypes.REMOVE_RIGHTS_FILTER: {
            const criteria = filter => filter !== payload.filter;
            const updatedColumn = filteringObject(state.filter && state.filter.column, criteria);
            const updatedExternal = filteringObject(state.filter && state.filter.external, criteria);
            const updatedFilter = {
                column: updatedColumn,
                external: updatedExternal,
            };

            return {
                ...state,
                filter: updatedFilter,
            };
        }
        case actionTypes.SET_RIGHTS_FILTER:
            return {
                ...state,
                filter: payload,
            };
        default:
            return state;
    }
};

export default rightsReducer;
