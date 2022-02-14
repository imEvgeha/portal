import {combineReducers} from 'redux';
import errorReducer from './error/errorReducer';
import gridReducer from './grid/gridReducer';
import loadingReducer from './loading/loadingReducer';
import successReducer from './success/successReducer';
import toastReducer from './toast/NexusToastNotificationReducer';

const uiReducer = combineReducers({
    loading: loadingReducer,
    success: successReducer,
    error: errorReducer,
    toast: toastReducer,
    grid: gridReducer,
});

export default uiReducer;
