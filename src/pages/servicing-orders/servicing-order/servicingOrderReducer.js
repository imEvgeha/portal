// holds state for a single servicing order - barcodes and source / service table data
const initialState = {};

const servicingOrderReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_ORDER':
            return state;
        case 'SAVE_ORDER':
            return action.payload;
        case 'RESET':
            return initialState;
        default:
            return state;
    }
};

export default servicingOrderReducer;
