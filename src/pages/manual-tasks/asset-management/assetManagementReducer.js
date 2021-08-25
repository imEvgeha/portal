import {STORE_POSTERS} from './assetManagementActionTypes';

const initialState = {
    posterList: [],
};

const assetManagementReducer = (state = initialState, action) => {
    switch (action.type) {
        case STORE_POSTERS:
            return {
                ...state,
                posterList: action.payload,
            };
        default:
            return state;
    }
};

export default assetManagementReducer;
