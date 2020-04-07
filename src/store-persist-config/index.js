import {persistStore, persistReducer, createMigrate} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import * as migrations from './migrations';
import * as availsMigrations from '../pages/avails/availsMigrations';
//import {createWhitelistFilter} from 'redux-persist-transform-filter';

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

export const rootPersistConfig = {
    key: 'root',
    keyPrefix: STORE_PERSIST_KEY_PREFIX,
    version: 0,
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['columnsSize'],
    transforms: [
        // createWhitelistFilter('rights', ['list']) // second argument = persisted keys
    ],
};

export const authPersistConfig = {
    key: 'auth',
    keyPrefix: STORE_PERSIST_KEY_PREFIX,
    version: 0,
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['token', 'refreshToken'],
};

export const createPersistReducer = (config, reducer) => persistReducer(config, reducer);

export const configurePersistor = store => persistStore(store);
