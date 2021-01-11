import {connectRouter} from 'connected-react-router';
import {combineReducers} from 'redux';
import assetManagementReducer from './assetManagementReducer';

const createRootReducer = routerHistory =>
    combineReducers({
        router: connectRouter(routerHistory),
        assetManagement: assetManagementReducer,
    });

export default createRootReducer;
