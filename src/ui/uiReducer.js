import gridReducer from '@vubiquity-nexus/portal-ui/lib/grid/gridReducer';
import toastReducer from '@vubiquity-nexus/portal-ui/lib/toast/toastReducer';
import {combineReducers} from 'redux';
import errorReducer from './error/errorReducer';
import loadingReducer from './loading/loadingReducer';
import successReducer from './success/successReducer';

const uiReducer = combineReducers({
    loading: loadingReducer,
    success: successReducer,
    error: errorReducer,
    toast: toastReducer,
    grid: gridReducer,
});

export default uiReducer;
