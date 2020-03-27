import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware, {END} from 'redux-saga';
// import {createLogger} from 'redux-logger';
import {composeWithDevTools} from 'redux-devtools-extension';
import {routerMiddleware} from 'connected-react-router';
import {throttle} from 'lodash';
import createRootReducer from './reducer';
// import {createPersistReducer, persistConfig} from './store-persist-config';

// configure store
const configureStore = (initialState = {}, history) => {
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
    
    // switch to root redux persist
    // const rootReducer = createPersistReducer(persistConfig, createRootReducer(history));

    const store = createStore(
        createRootReducer(history),
        composeWithDevTools(
            applyMiddleware(...middleware),
        ),
    );
    store.runSaga = sagaMiddleware.run;

    store.close = () => store.dispatch(END);

    return store;
};

export default configureStore;
