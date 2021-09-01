import {TOTAL_RIGHTS} from '../../../constants/avails/manualRightsEntryTabs';
import {
    MANUAL_RIGHT_ENTRY__SELECT_ROW,
    MANUAL_RIGHT_ENTRY__SET_SELECTED_TAB,
    MANUAL_RIGHT_ENTRY__UPDATE_COLUMNS,
    MANUAL_RIGHT_ENTRY__UPDATE,
    MANUAL_RIGHT_ENTRY__LOADING,
    MANUAL_RIGHT_ENTRY__SORT,
} from '../../../constants/action-types';
import {saveManualRightEntryState} from '../../index';

const initialState = {
    tabPage: {
        pages: 0,
        avails: [],
        pageSize: 0,
        total: 0,
    },
    tabPageLoading: false,
    session: {
        selectedTab: TOTAL_RIGHTS,
        tabPageSelection: {
            selected: [],
            selectNone: true,
            selectAll: false,
        },
        tabPageSort: [],
        columnsSize: {},
        columns: ['title', 'productionStudio', 'territory', 'genres', 'start', 'end'],
    },
};

const manualRightsEntry = (state = initialState, action) => {
    switch (action.type) {
        case MANUAL_RIGHT_ENTRY__UPDATE:
            return {...state, tabPage: {...state.tabPage, ...action.payload}};
        case MANUAL_RIGHT_ENTRY__LOADING:
            return {...state, tabPageLoading: action.payload};
        case MANUAL_RIGHT_ENTRY__SET_SELECTED_TAB:
            saveManualRightEntryState();
            return {...state, session: {...state.session, selectedTab: action.payload}};
        case MANUAL_RIGHT_ENTRY__UPDATE_COLUMNS:
            saveManualRightEntryState();
            return {...state, session: {...state.session, columns: action.payload}};
        case MANUAL_RIGHT_ENTRY__SELECT_ROW:
            saveManualRightEntryState();
            return {...state, session: {...state.session, tabPageSelection: action.payload}};
        case MANUAL_RIGHT_ENTRY__SORT:
            saveManualRightEntryState();
            return {...state, session: {...state.session, tabPageSort: action.payload}};
        default:
            return state;
    }
};

export default manualRightsEntry;
