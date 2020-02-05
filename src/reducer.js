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
import rightMatching from './avails/right-matching/rightMatchingReducer';
import titleMatching from './avails/title-matching/titleMatchingReducer';
import localeReducer from './stores/reducers/localization/localeReducer';
import rightHistory from './avails/right-history-view/rightHistoryReducer';
import manualRightsEntry from './stores/reducers/avail/manualRightsEntry';
import toastReducer from './ui-elements/nexus-toast-notification/reducer';
import availsReducer from './avails/availsReducer';
import metadataReducer from './metadata/metadataReducer';

const createRootReducer = routerHistory => combineReducers({
    router: connectRouter(routerHistory),
    root,
    titleReducer,
    dashboard,
    media,
    history,
    createright,
    dopReducer,
    settings,
    rightMatching,
    titleMatching,
    localeReducer,
    rightHistory,
    manualRightsEntry,
    toastReducer,
    avails: availsReducer,
    metadata: metadataReducer,
});

export default createRootReducer;
