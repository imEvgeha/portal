import {createStore, applyMiddleware } from 'redux';
import createSagaMiddleware, {END} from 'redux-saga';
// import {createLogger} from 'redux-logger';
import {composeWithDevTools} from 'redux-devtools-extension';
import {routerMiddleware} from 'connected-react-router';
import throttle from 'lodash.throttle';
import createRootReducer from './reducer';
import {loadAppState, saveAppState} from './localStorage';

const DELAY = 1000;

// configure store
const configureStore = (initialState = {}, history) => {
    const persistedState = loadAppState();
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

    const store = createStore(
        createRootReducer(history),
        persistedState,
        composeWithDevTools(
            applyMiddleware(...middleware),
        ),
    );
    store.runSaga = sagaMiddleware.run;

    // subscribe
    store.subscribe(throttle(() => {
        saveAppState({
            avails: store.getState().avails,
        });
    }, DELAY));

    store.close = () => store.dispatch(END);

    return store;
};

export default configureStore;
