// holds state for a single servicing order - barcodes and source / service table data
const initialState = {
    config: null,
};

const servicingOrderReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_ORDER':
            return state;
        case 'SAVE_ORDER':
            return action.payload;
        case 'GET_CONFIG':
            return {...state, config: {a: 123, b: 345 } };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
};

export default servicingOrderReducer;
