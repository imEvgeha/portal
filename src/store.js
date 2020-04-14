import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware, {END} from 'redux-saga';
import {createLogger} from 'redux-logger';
import {composeWithDevTools} from 'redux-devtools-extension';
import {routerMiddleware} from 'connected-react-router';
import createRootReducer from './reducer';
// import {createPersistReducer, persistConfig} from './store-persist-config';
import {LOGOUT} from './auth/authActionTypes';
import storage from 'redux-persist/lib/storage';
import {keycloak} from './auth/keycloak';

// configure store
const configureStore = (initialState = {}, history) => {
    const sagaMiddleware = createSagaMiddleware();
    let middleware = [
        routerMiddleware(history),
        sagaMiddleware,
    ];
    
    // log redux actions 
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undfined') {
        middleware = [...middleware, createLogger()];
    }

    // switch to root redux persist
    // const rootReducer = createPersistReducer(persistConfig, createRootReducer(history));
    const appReducer = createRootReducer(history);
    const rootReducer = (state, action) => {
        if (action.type === LOGOUT) {
            // remove persist storage
            storage.removeItem('portal-persist:avails');
            storage.removeItem('portal-persist:root');
            storage.removeItem('portal-persist:auth');
            keycloak.logout();
            return undefined;
        }
        return appReducer(state, action);
    };

    const store = createStore(
        rootReducer,
        composeWithDevTools(
            applyMiddleware(...middleware),
        ),
    );

    store.runSaga = sagaMiddleware.run;

    store.close = () => store.dispatch(END);

    return store;
};

export default configureStore;
