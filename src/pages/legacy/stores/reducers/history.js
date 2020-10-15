import {
    LOAD_HISTORY_SESSION,
    HISTORY_SEARCH_FORM__UPDATE_ADVANCED_SEARCH_CRITERIA,
    HISTORY_SEARCH_FORM__SET_ADVANCED_SEARCH_CRITERIA,
    HISTORY_SEARCH_FORM__SET_SEARCH_CRITERIA,
    HISTORY_RESULT_PAGE__LOADING,
    HISTORY_RESULT_PAGE__UPDATE,
} from '../../constants/action-types';

import {saveHistoryState} from '../index';

const initialState = {
    availHistoryLoading: false,
    availHistoryPage: {
        pages: 0,
        records: [],
        pageSize: 0,
        total: 0,
    },
    session: {
        advancedSearchCriteria: {
            provider: '',
            received: null,
            status: '',
            ingestType: '',
        },
        searchCriteria: {},
        sort: [],
    },
};

const history = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_HISTORY_SESSION:
            return {
                ...state,
                session: {
                    ...state.session,
                    ...action.payload,
                    advancedSearchCriteria: {
                        ...state.session.advancedSearchCriteria,
                        ...action.payload.advancedSearchCriteria,
                    },
                },
            };
        case HISTORY_SEARCH_FORM__UPDATE_ADVANCED_SEARCH_CRITERIA:
            saveHistoryState();
            return {
                ...state,
                session: {
                    ...state.session,
                    advancedSearchCriteria: {...state.session.advancedSearchCriteria, ...action.payload},
                },
            };
        case HISTORY_SEARCH_FORM__SET_ADVANCED_SEARCH_CRITERIA:
            saveHistoryState();
            return {...state, session: {...state.session, advancedSearchCriteria: action.payload}};
        case HISTORY_SEARCH_FORM__SET_SEARCH_CRITERIA:
            saveHistoryState();
            return {...state, session: {...state.session, searchCriteria: action.payload}};
        case HISTORY_RESULT_PAGE__LOADING:
            return {...state, availHistoryLoading: action.payload};
        case HISTORY_RESULT_PAGE__UPDATE:
            return {...state, availHistoryPage: {...state.availHistoryPage, ...action.payload}};
        default:
            return state;
    }
};

export default history;
