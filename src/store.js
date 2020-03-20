import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware, {END} from 'redux-saga';
// import {createLogger} from 'redux-logger';
import {composeWithDevTools} from 'redux-devtools-extension';
import {routerMiddleware} from 'connected-react-router';
import {throttle} from 'lodash';
import {persistStore, persistReducer, createMigrate} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createRootReducer from './reducer';
// import {loadAppState, saveAppState} from './localStorage';
import * as migrations from './persist-config/migrations';
import {createPersistReducer, persistConfig} from './persist-config';

const DELAY = 1000;

// configure store
const configureStore = (initialState = {}, history) => {
    // const persistedState = loadAppState();
    const sagaMiddleware = createSagaMiddleware();
    const middleware = [
        routerMiddleware(history),
        sagaMiddleware,
    ];
    // TODO - activate logger middleware when webpack config is set 
    // so we can access to environment variables via process.env
    // const loggerMiddleware = createLogger({
    //     predicate: () => process.env.NODE_ENV === 'development',
    // });
    // middleware = [...middleware, loggerMiddleware];
    
    const rootReducer = createPersistReducer(persistConfig, createRootReducer(history));

    const store = createStore(
        rootReducer,
        // persistedState,
        composeWithDevTools(
            applyMiddleware(...middleware),
        ),
    );
    store.runSaga = sagaMiddleware.run;

    // subscribe
    // store.subscribe(throttle(() => {
    //     saveAppState({
    //         avails: store.getState().avails,
    //     });
    // }, DELAY));
    //
    store.close = () => store.dispatch(END);

    return store;
};

export default configureStore;
