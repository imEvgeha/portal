import {routerMiddleware} from 'connected-react-router';
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {createLogger} from 'redux-logger';
import createSagaMiddleware, {END} from 'redux-saga';
import createRootReducer from './reducer';

// configure store
// eslint-disable-next-line no-unused-vars
const configureStore = (initialState = {}, history) => {
    const sagaMiddleware = createSagaMiddleware();
    let middleware = [routerMiddleware(history), sagaMiddleware];

    // log redux actions
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        middleware = [...middleware, createLogger()];
    }

    // switch to root redux persist
    // const rootReducer = createPersistReducer(persistConfig, createRootReducer(history));
    const appReducer = createRootReducer(history);
    const rootReducer = (state, action) => {
        return appReducer(state, action);
    };

    const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));

    store.runSaga = sagaMiddleware.run;

    store.close = () => store.dispatch(END);

    return store;
};

export default configureStore;
