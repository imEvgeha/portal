import {LOGOUT} from '@vubiquity-nexus/portal-auth/authActionTypes';
import {keycloak} from '@vubiquity-nexus/portal-auth/keycloak';
import {routerMiddleware} from 'connected-react-router';
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware, {END} from 'redux-saga';
import DOPService from './pages/avails/selected-for-planning/DOP-services';
import createRootReducer from './reducer';

// configure store
// eslint-disable-next-line no-unused-vars
const configureStore = (initialState = {}, history) => {
    const sagaMiddleware = createSagaMiddleware();
    const middleware = [routerMiddleware(history), sagaMiddleware];

    // switch to root redux persist
    // const rootReducer = createPersistReducer(persistConfig, createRootReducer(history));
    const appReducer = createRootReducer(history);
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
