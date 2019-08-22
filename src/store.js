import {createStore, applyMiddleware } from 'redux';
import createSagaMiddleware, {END} from 'redux-saga';
// import {createLogger} from 'redux-logger';
import {composeWithDevTools} from 'redux-devtools-extension';
import {routerMiddleware} from 'connected-react-router';
import createRootReducer from './reducer';

// configure store
const configureStore = (initialState = {}, history) => {
    const sagaMiddleware = createSagaMiddleware();
    let middleware = [
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
        initialState,
        composeWithDevTools(
            applyMiddleware(...middleware),
        ),
    );
    store.runSaga = sagaMiddleware.run;
    store.close = () => store.dispatch(END);

    return store;
};

export default configureStore;
