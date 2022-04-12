import {LOGOUT} from '@vubiquity-nexus/portal-auth/authActionTypes';
import {keycloak} from '@vubiquity-nexus/portal-auth/keycloak';
import {createBrowserHistory} from 'history';
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {createReduxHistoryContext} from 'redux-first-history';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware, {END} from 'redux-saga';
import DOPService from './pages/avails/selected-for-planning/DOP-services';
import createRootReducer from './reducer';

const {createReduxHistory, routerMiddleware, routerReducer} = createReduxHistoryContext({
    history: createBrowserHistory(),
});

export const configureHistory = store => createReduxHistory(store);

// configure store
// eslint-disable-next-line no-unused-vars
const configureStore = (initialState = {}) => {
    const sagaMiddleware = createSagaMiddleware();
    const middleware = [routerMiddleware, sagaMiddleware];

    // switch to root redux persist
    // const rootReducer = createPersistReducer(persistConfig, createRootReducer(history));
    const appReducer = createRootReducer(routerReducer);
    const rootReducer = (state, action) => {
        if (action.type === LOGOUT) {
            // remove persist storage
            storage.removeItem('portal-persist:auth');
            DOPService.logout();
            keycloak.logout();
            return undefined;
        }
        return appReducer(state, action);
    };

    const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));

    store.runSaga = sagaMiddleware.run;

    store.close = () => store.dispatch(END);

    return store;
};

export default configureStore;
