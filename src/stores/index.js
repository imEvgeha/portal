import {combineReducers, createStore} from 'redux';
import root from '../reducers/index';
import dashboard from '../reducers/dashboard';
import {loadDashboardSession} from '../actions/dashboard';

const DASHBOARD_SESSION_VERSION = '0.1';

const reducers = combineReducers({
    root,
    dashboard,
});

const store = createStore(reducers);

export default store;

export const loadDashboardState = () => {
    loadFromWebLocalStorage('dashboard', loadDashboardSession, DASHBOARD_SESSION_VERSION);
};

export const saveDashboardState = () => {
    saveToWebLocalStorage('dashboard', DASHBOARD_SESSION_VERSION);
};

const loadFromWebLocalStorage = (name, loadAction, version) => {
    setTimeout(() => {try {
        console.log('Try ' + 'state-' + name + '-' + version + '-' + store.getState().root.profileInfo.email);
        const serializedState = localStorage.getItem('state-' + name + '-' + version + '-' + store.getState().root.profileInfo.email);
        if (serializedState === null) {
            return undefined;
        }
        console.log(JSON.parse(serializedState));
        store.dispatch(loadAction(JSON.parse(serializedState)));
    } catch (err) {
        return undefined;
    }
    }, 100);
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
