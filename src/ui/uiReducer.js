import {combineReducers} from 'redux';
import loadingReducer from './loading/loadingReducer';
import toastReducer from './toast/toastReducer';

const uiReducer = combineReducers({
    loading: loadingReducer,
    toast: toastReducer,
});

export default uiReducer;
