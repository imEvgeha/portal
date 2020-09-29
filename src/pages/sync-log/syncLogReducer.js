import {SAVE_DATE_FROM, SAVE_DATE_TO} from './syncLogActionTypes';

const initialState = {
    dateFrom: '',
    dateTo: '',
};

const syncLogReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_DATE_FROM: {
            return {
                ...state,
                dateFrom: action.payload,
            };
        }

        case SAVE_DATE_TO: {
            return {
                ...state,
                dateTo: action.payload,
            };
        }

        default:
            return state;
    }
};

export default syncLogReducer;
