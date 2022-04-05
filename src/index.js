import React from 'react';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {createKeycloakInstance} from '@vubiquity-nexus/portal-auth/keycloak';
import ErrorBoundary from '@vubiquity-nexus/portal-ui/lib/elements/nexus-error-boundary/ErrorBoundary';
import NexusLayout from '@vubiquity-nexus/portal-ui/lib/elements/nexus-layout/NexusLayout';
import Toast from '@vubiquity-nexus/portal-ui/lib/toast/NexusToastNotification';
import {LicenseManager} from 'ag-grid-enterprise';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import {Provider} from 'react-redux';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import '@vubiquity-nexus/portal-styles/scss/index.scss';
import {HistoryRouter as ConnectedRouter} from 'redux-first-history/rr6';
import AppProviders from './AppProviders';
import Router from './Router';
import {getConfig, setEnvConfiguration} from './config';
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

// setEnvConfiguration('qa')
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
    <AppContainer>
        <Provider store={store}>
            <AppProviders persistor={persistor}>
                <ConnectedRouter history={history}>
                    <ErrorBoundary>
                        <Toast />
                        <NexusLayout>
                            <Router routes={routesWithTracking()} />
                        </NexusLayout>
                    </ErrorBoundary>
                </ConnectedRouter>
            </AppProviders>
        </Provider>
    </AppContainer>
);

function renderApp() {
    createKeycloakInstance(getConfig('keycloak'));
    initializeTracker();
    store.runSaga(rootSaga);
    render(<App />, document.getElementById('app'));
}

if (module.hot) {
    module.hot.accept(
        [
            // TODO: we should enable AppProviders too
            '@vubiquity-nexus/portal-ui/lib/elements/nexus-layout/NexusLayout',
            './Router',
            './routes',
            './saga',
        ],
        () => {
            render(<App />, document.getElementById('app'));
        }
    );
}
