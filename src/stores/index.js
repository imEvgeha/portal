import {combineReducers, createStore} from 'redux';
import root from '../reducers/index';
import dashboard from '../reducers/dashboard';
import {loadDashboardSession} from '../actions/dashboard';
import {advancedSearchHelper} from '../containers/dashboard/AdvancedSearchHelper';

const DASHBOARD_SESSION_VERSION = '0.2';

const reducers = combineReducers({
    root,
    dashboard,
});

const store = createStore(reducers);

export default store;

export const loadDashboardState = () => {
    loadFromWebLocalStorage('dashboard', loadDashboardSession, DASHBOARD_SESSION_VERSION);
    setTimeout(() => {
        advancedSearchHelper.advancedSearch(store.getState().dashboard.session.searchCriteria);
    }, 100);
};

export const saveDashboardState = () => {
    saveToWebLocalStorage('dashboard', DASHBOARD_SESSION_VERSION);
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
