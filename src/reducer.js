import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import root from './pages/legacy/stores/reducers/index';
import titleReducer from './pages/legacy/stores/reducers/metadata/titleReducer';
import dashboard from './pages/legacy/stores/reducers/avail/dashboard';
import createright from './pages/legacy/stores/reducers/avail/createright';
import history from './pages/legacy/stores/reducers/history';
import media from './pages/legacy/stores/reducers/media/search';
import dopReducer from './pages/legacy/stores/reducers/DOP/dopReducer';
import localeReducer from './pages/legacy/stores/reducers/localization/localeReducer';
import manualRightsEntry from './pages/legacy/stores/reducers/avail/manualRightsEntry';
import settings from './pages/legacy/containers/settings/settingsReducer';
import rightHistory from './pages/avails/right-history-view/rightHistoryReducer';
import availsReducer from './pages/avails/availsReducer';
import metadataReducer from './pages/metadata/metadataReducer';
import eventManagementReducer from './pages/event-management/eventManagementReducer';
import servicingOrdersReducer from './pages/servicing-orders/servicingOrdersReducer';
import uiReducer from './ui/uiReducer.js';
import authReducer from './auth/authReducer';
import {availsPersistConfig, authPersistConfig, createPersistReducer, rootPersistConfig} from './store-persist-config';

const createRootReducer = routerHistory => combineReducers({
    router: connectRouter(routerHistory),
    locale: localeReducer, // check it

    root: createPersistReducer(rootPersistConfig, root), // rename it to 'config'
    settings, 
    media,
    dopReducer, // separate DOP reducer for all pages or integrate DOP per domain

    titleReducer, // remove it
    dashboard, // remove it
    history, // remove it
    createright, // remove it
    manualRightsEntry, // remove it

    // new structure
    avails: createPersistReducer(availsPersistConfig, availsReducer),
    metadata: metadataReducer,
    eventManagement: eventManagementReducer,
    servicingOrders: servicingOrdersReducer,
    ui: uiReducer,
    auth: createPersistReducer(authPersistConfig, authReducer),
});

export default createRootReducer;

