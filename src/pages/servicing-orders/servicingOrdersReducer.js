import {combineReducers} from 'redux';
import servicingOrderReducer from './servicing-order/servicingOrderReducer';

const servicingOrdersReducer = combineReducers({
    servicingOrder: servicingOrderReducer,
});

export default servicingOrdersReducer;
