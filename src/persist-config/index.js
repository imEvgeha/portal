import {compose} from 'redux';
import {persistStore, persistReducer, createMigrate} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createRootReducer from '../reducer';
import * as migrations from './migrations';
import configureStore from '../store';

export const persistConfig = {
    key: 'root',
    storage,
    whitelist: [],
    migrate: createMigrate(migrations, {debug: true}),
};

export const availsPersistConfig = {
    key: 'avails',
    storage,
    whitelist: ['ingest', 'rights'],
    migrate: createMigrate(migrations, {debug: true}),
};

export const createPersistReducer = (config, reducer) => persistReducer(config, reducer);

export const configurePersistor = store => persistStore(store);
