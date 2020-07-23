import {ADD_TOAST, REMOVE_TOAST} from './toastActionTypes';

const initialState = {
    list: [],
};

const toastReducer = (state = initialState, action) => {
    const {type, payload} = action;
    switch (type) {
        case ADD_TOAST:
            return {
                ...state,
                list: [payload, ...state.list],
            };
        case REMOVE_TOAST: {
            const newList = state.list.filter((toast, i) => i !== (payload || 0));
            return {
                ...state,
                list: newList,
            };
        }
        default:
            return state;
    }
};

export default toastReducer;
