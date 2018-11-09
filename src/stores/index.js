import {combineReducers, createStore} from 'redux';
import root from '../reducers/index';
import dashboard from '../reducers/dashboard';
import {loadSession} from '../actions';
import session from '../reducers/session';

const reducers = combineReducers({
    root,
    session,
    dashboard,
});

const store = createStore(reducers);

export default store;

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state-' + store.getState().root.profileInfo.email);
        if (serializedState === null) {
            return undefined;
        }
        store.dispatch(loadSession(JSON.parse(serializedState)));
    } catch (err) {
        return undefined;
    }
};

export const saveState = () => {
    setTimeout(() => {
        try {
            const serializedState = JSON.stringify(store.getState().session);
            localStorage.setItem('state-' + store.getState().root.profileInfo.email, serializedState);
        } catch (error) {
            // ignore write errors
        }
    }, 100);
};
