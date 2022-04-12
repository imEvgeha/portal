import authReducer from '@vubiquity-nexus/portal-auth/authReducer';
import uiReducer from '@vubiquity-nexus/portal-ui/lib/uiReducer';
import {combineReducers} from 'redux';
import availsReducer from './pages/avails/availsReducer';
import dopTasksReducer from './pages/dop-tasks/dopTasksReducer';
import eventManagementReducer from './pages/event-management/eventManagementReducer';
import endpointConfigReducer from './pages/legacy/containers/avail/service/endpointConfigReducer';
import settings from './pages/legacy/containers/settings/settingsReducer';
import dopReducer from './pages/legacy/stores/reducers/DOP/dopReducer';
import dashboard from './pages/legacy/stores/reducers/avail/dashboard';
import manualRightsEntry from './pages/legacy/stores/reducers/avail/manualRightsEntry';
import root from './pages/legacy/stores/reducers/index';
import localeReducer from './pages/legacy/stores/reducers/localization/localeReducer';
import titleReducer from './pages/legacy/stores/reducers/metadata/titleReducer';
import manualTasksReducer from './pages/manual-tasks/manualTasksReducer';
import metadataReducer from './pages/metadata/metadataReducer';
import servicingOrdersReducer from './pages/servicing-orders/servicingOrdersReducer';
import syncLogReducer from './pages/sync-log/syncLogReducer';
import titleMetadataReducer from './pages/title-metadata/titleMedatadaReducer';
import {
    authPersistConfig,
    availsPersistConfig,
    createPersistReducer,
    dopTasksPersistConfig,
    rootPersistConfig,
    titleMetadataPersistConfig,
} from './store-persist-config';

const createRootReducer = routerHistory =>
    combineReducers({
        router: routerHistory,
        locale: localeReducer, // check it
        root: createPersistReducer(rootPersistConfig, root), // rename it to 'config'
        settings,
        dopReducer, // separate DOP reducer for all pages or integrate DOP per domain
        titleReducer, // remove it
        dashboard, // remove it
        manualRightsEntry, // remove it
        // new structure
        avails: createPersistReducer(availsPersistConfig, availsReducer),
        metadata: metadataReducer,
        eventManagement: eventManagementReducer,
        servicingOrders: servicingOrdersReducer,
        syncLog: syncLogReducer,
        manualTasks: manualTasksReducer,
        dopTasks: createPersistReducer(dopTasksPersistConfig, dopTasksReducer),
        ui: uiReducer,
        auth: createPersistReducer(authPersistConfig, authReducer),
        titleMetadata: createPersistReducer(titleMetadataPersistConfig, titleMetadataReducer),
        endpointConfigValues: endpointConfigReducer,
    });

export default createRootReducer;
