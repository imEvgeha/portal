import React from 'react';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@portal/portal-icons/portalicons.css';
import {createKeycloakInstance} from '@portal/portal-auth';
import ErrorBoundary from '@vubiquity-nexus/portal-ui/lib/elements/nexus-error-boundary/ErrorBoundary';
import Toast from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotification';
import {getAuthConfig, loadConfig, setConfig} from '@vubiquity-nexus/portal-utils/lib/config';
import {LicenseManager} from 'ag-grid-enterprise';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import '@vubiquity-nexus/portal-styles/scss/index.scss';
import '@portal/portal-components/index';
import {HistoryRouter} from 'redux-first-history/rr6';
import packageJson from '../package.json';
import endpoints from '../profile/endpoints.json';
import AppProviders from './AppProviders';
import Router from './Router';
import {defaultConfiguration} from './config';
import NotFound from './pages/static/NotFound';
import {routesWithTracking} from './routes';
import rootSaga from './saga';
import configureStore, {configureHistory} from './store';
import {configurePersistor} from './store-persist-config';
import {initializeTracker} from './util/hoc/withTracker';
import './styles/legacy/WeAre138.scss'; // TODO: lovely file name - remove
import './styles/legacy/global.scss'; // TODO; refactor
import './styles/bootstrap.scss';
import './styles/prime-custom.scss';

const AG_GRID_LICENSE_KEY =
    'CompanyName=QBS Software Ltd_on_behalf_of_VUBIQUITY MANAGEMENT LIMITED,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=4,LicensedProductionInstancesCount=0,AssetReference=AG-019524,ExpiryDate=11_November_2022_[v2]_MTY2ODEyNDgwMDAwMA==9e3648df22b0693cd75412f61e4125f1';
LicenseManager.setLicenseKey(AG_GRID_LICENSE_KEY);

const setEnvConfiguration = async () => {
    const {version: portalVersion} = packageJson;
    setConfig({portalVersion});
    setConfig(defaultConfiguration);

    await loadConfig('/config.json', endpoints);
    return new Promise(resolve => {
        resolve();
    });
};

setEnvConfiguration()
    .then(() => renderApp())
    .catch(error => {
        // eslint-disable-next-line
        console.error(error);
        render(<p>Problem with configuration, application cannot be started</p>, document.querySelector('#app'));
    });

// temporary export -> we should not export store
// eslint-disable-next-line no-underscore-dangle
export const store = configureStore(window.__PRELOADED_STATE__ || {});
export const history = configureHistory(store);

const persistor = configurePersistor(store);

// eslint-disable-next-line
delete window.__PRELOADED_STATE__;

const App = () => (
    <HistoryRouter history={history}>
        <Provider store={store}>
            <AppProviders persistor={persistor}>
                <ErrorBoundary>
                    <Toast />
                    <Router routes={routesWithTracking()} />
                </ErrorBoundary>
            </AppProviders>
        </Provider>
    </HistoryRouter>
);

function renderApp() {
    const kconfig = getAuthConfig();
    createKeycloakInstance(kconfig);
    initializeTracker();
    store.runSaga(rootSaga);
    render(kconfig.realm ? <App /> : <NotFound />, document.getElementById('app'));
}
