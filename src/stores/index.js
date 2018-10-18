import {combineReducers, createStore} from 'redux';
import root from '../reducers/index';
import dashboard from '../reducers/dashboard';

const reducers = combineReducers({
    root,
    dashboard
});

const store = createStore(reducers);

export default store;