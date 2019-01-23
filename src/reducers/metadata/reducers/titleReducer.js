import { METADATA_TITLE_DASHBOARD_CREATE_TITLE } from '../../../constants/action-types';

const initialState = {
    titles: [{}],
    title: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case METADATA_TITLE_DASHBOARD_CREATE_TITLE: 
            return {
                ...state,
                title: action.payload
            };
        default:
            return state;
    }
}