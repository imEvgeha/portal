import {persistStore, persistReducer, createMigrate} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createRootReducer from '../reducer';
import configureStore from '../store';
import {createWhitelistFilter} from 'redux-persist-transform-filter';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import * as migrations from './migrations';
import * as availsMigrations from '../avails/availsMigrations';

const STORE_PERSIST_KEY_PREFIX = 'portal-persist:';

export const persistConfig = {
    key: 'root',
    keyPrefix: STORE_PERSIST_KEY_PREFIX,
    storage,
    whitelist: [],
    stateReconciler: autoMergeLevel2,
    migrate: createMigrate(migrations, {debug: true}),
};

export const availsPersistConfig = {
    key: 'avails',
    keyPrefix: STORE_PERSIST_KEY_PREFIX,
    version: 0,
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['ingest', 'rights'],
    transforms: [
        // createWhitelistFilter('rights', ['list']) // second argument = persisted keys
    ],
    migrate: createMigrate(availsMigrations, {debug: true}),
};

export const createPersistReducer = (config, reducer) => persistReducer(config, reducer);

export const configurePersistor = store => persistStore(store);
