import {combineReducers} from 'redux';
import loadingReducer from './loading/loadingReducer';
import errorReducer from './error/errorReducer';
import toastReducer from './toast/toastReducer';
import successReducer from './success/successReducer';

const uiReducer = combineReducers({
    loading: loadingReducer,
    success: successReducer,
    error: errorReducer,
    toast: toastReducer,
});

export default uiReducer;
