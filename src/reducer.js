import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import root from './stores/reducers/index';
import titleReducer from './stores/reducers/metadata/titleReducer';
import dashboard from './stores/reducers/avail/dashboard';
import createright from './stores/reducers/avail/createright';
import history from './stores/reducers/history';
import media from './stores/reducers/media/search';
import dopReducer from './stores/reducers/DOP/dopReducer';
import settings from './containers/settings/settingsReducer';
import localeReducer from './stores/reducers/localization/localeReducer';
import rightHistory from './avails/right-history-view/rightHistoryReducer';
import manualRightsEntry from './stores/reducers/avail/manualRightsEntry';
import availsReducer from './avails/availsReducer';
import metadataReducer from './metadata/metadataReducer';
import uiReducer from './ui/uiReducer.js';
import {availsPersistConfig, createPersistReducer} from './persist-config';

const createRootReducer = routerHistory => combineReducers({
    router: connectRouter(routerHistory),
    locale: localeReducer, // check it

    root, // rename it to 'config'
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
    ui: uiReducer,
});

export default createRootReducer;
