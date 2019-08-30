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
});

export default createRootReducer;
