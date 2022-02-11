import {HANDLE_CONFIG_ENDPOINT_SUCCESS} from './endpointConfigActions';

const endpointConfigReducer = (state = {}, action) => {
    const {type, payload} = action;
    switch (type) {
        case HANDLE_CONFIG_ENDPOINT_SUCCESS:
            return {
                ...state,
                ...payload,
            };
        default:
            return state;
    }
};

export default endpointConfigReducer;
