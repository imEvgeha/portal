import * as actionTypes from './rightsActionTypes';

const initialState = {
    right: {},
    list: {},
    total: 0,
    selected: {},
    prePlanRights: {},
    rightsWithDependencies: {},
    deletedRightsCount: 0,
    filter: {
        column: {},
        external: {},
    },
    gridState: {},
    fromSelected: {},
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
        case actionTypes.CLEAR_RIGHT:
            return {
                ...state,
                right: {},
            };
        case actionTypes.SET_SELECTED_RIGHTS: {
            // const {selected = {}} = state;
            return {
                ...state,
                selected: {...payload},
            };
        }
        case actionTypes.SET_PREPLAN_RIGHTS: {
            const {prePlanRights = {}} = state;
            return {
                ...state,
                prePlanRights: {...prePlanRights, ...payload},
            };
        }
        case actionTypes.SET_LINKED_TO_ORIGINAL_RIGHTS: {
            const {rightsWithDeps = {}, deletedRightsCount = 0} = payload || {};
            return {
                ...state,
                rightsWithDependencies: rightsWithDeps,
                deletedRightsCount,
            };
        }

        case actionTypes.CLEAR_LINKED_TO_ORIGINAL_RIGHTS:
        case actionTypes.GET_LINKED_TO_ORIGINAL_RIGHTS_ERROR:
        case actionTypes.BULK_DELETE_SELECTED_RIGHTS_ERROR:
            return {
                ...state,
                rightsWithDependencies: {},
                deletedRightsCount: 0,
            };
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
        case actionTypes.GET_RIGHT_REQUEST: {
            return {
                ...state,
                right: {},
            };
        }
        case actionTypes.GET_RIGHT_SUCCESS: {
            return {
                ...state,
                right: payload,
            };
        }
        case actionTypes.GET_RIGHT_ERROR: {
            return {
                ...state,
                right: {},
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
        case actionTypes.SET_AVAILS_USER_DEFINED_GRID:
            return {
                ...state,
                gridState: {...state.gridState, ...payload},
            };
        case actionTypes.STORE_FROM_SELECTED_TABLE: {
            const {fromSelected = {}} = state;
            return {
                ...state,
                fromSelected: {...fromSelected, ...payload},
            };
        }
        case actionTypes.SET_CURRENT_USER_VIEW_AVAILS: {
            return {
                ...state,
                currentUserView: payload,
            };
        }
        case actionTypes.SET_AVAILS_GRID_STATE: {
            return {
                ...state,
                gridState: {...state.gridState, ...payload},
            };
        }
        default:
            return state;
    }
};

export default rightsReducer;
