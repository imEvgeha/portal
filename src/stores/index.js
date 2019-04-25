import {combineReducers, createStore } from 'redux';
import root from './reducers/index';
import titleReducer from './reducers/metadata/titleReducer';
import dashboard from './reducers/avail/dashboard';
import createright from './reducers/avail/createright';
import history from './reducers/history';
import {loadDashboardSession} from './actions/avail/dashboard';
import {loadCreateRightSession} from './actions/avail/createright';
import {loadHistorySession} from './actions/avail/history';

const DASHBOARD_SESSION_VERSION = '0.5';
const CREATERIGHT_SESSION_VERSION = '0.2';
const HISTORY_SESSION_VERSION = '0.3';

const reducers = combineReducers({
    root,
    titleReducer,
    dashboard,
    history,
    createright
});
const store = createStore(reducers,  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()); // REDUX DEVTOOLS allows you to see your action and state changes real-time in the browser.

export default store;

export const loadHistoryState = () => {
    loadFromWebLocalStorage('history', loadHistorySession, HISTORY_SESSION_VERSION);
};
export const saveHistoryState = () => {
    saveToWebLocalStorage('history', HISTORY_SESSION_VERSION);
};

export const loadDashboardState = () => {
    loadFromWebLocalStorage('dashboard', loadDashboardSession, DASHBOARD_SESSION_VERSION);
};

export const saveDashboardState = () => {
    saveToWebLocalStorage('dashboard', DASHBOARD_SESSION_VERSION);
};

export const loadCreateRightState = () => {
    loadFromWebLocalStorage('createright', loadCreateRightSession, CREATERIGHT_SESSION_VERSION);
};

export const saveCreateRightState = () => {
    saveToWebLocalStorage('createright', CREATERIGHT_SESSION_VERSION);
};


const loadFromWebLocalStorage = (name, loadAction, version) => {
    try {
        const serializedState = localStorage.getItem('state-' + name + '-' + version + '-' + store.getState().root.profileInfo.email);
        if (serializedState === null) {
            return undefined;
        }
        store.dispatch(loadAction(JSON.parse(serializedState)));
    } catch (err) {
        return undefined;
    }
};

const saveToWebLocalStorage = (name, version) => {
    setTimeout(() => {
        try {
            const serializedState = JSON.stringify(store.getState()[name].session);
            localStorage.setItem('state-' + name + '-' + version + '-' + store.getState().root.profileInfo.email, serializedState);
        } catch (error) {
            // ignore write errors
        }
    }, 100);
};
