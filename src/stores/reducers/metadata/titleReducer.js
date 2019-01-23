import { GET_TITLE, UPDATE_TITLE, ADD_TITLE } from '../../../constants/action-types';

const initialState = {
    titles: [{}],
    title: {},
    status: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_TITLE: 
            return {
                ...state,
                title: action.payload
            };
        case GET_TITLE:
            return {
                ...state,
                title: action.payload
        };
        case UPDATE_TITLE:
            return {
                ...state,
                title: action.payload
            };
        default:
            return state;
    }
}