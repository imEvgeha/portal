import {combineReducers} from 'redux';
import loadingReducer from './loading/loadingReducer';
import errorReducer from './error/errorReducer';
import toastReducer from './toast/toastReducer';
import successReducer from './success/successReducer';
import gridReducer from './grid/gridReducer';

const uiReducer = combineReducers({
    loading: loadingReducer,
    success: successReducer,
    error: errorReducer,
    toast: toastReducer,
    grid: gridReducer,
});

export default uiReducer;
