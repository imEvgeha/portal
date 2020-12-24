import React from 'react';
import PropTypes from 'prop-types';
import {createKeycloakInstance} from '@vubiquity-nexus/portal-auth/keycloak';
import ErrorBoundary from '@vubiquity-nexus/portal-ui/lib/elements/nexus-error-boundary/ErrorBoundary';
import NexusLayout from '@vubiquity-nexus/portal-ui/lib/elements/nexus-layout/NexusLayout';
import Toast from '@vubiquity-nexus/portal-ui/lib/toast/Toast';
import {LicenseManager} from 'ag-grid-enterprise';
import {ConnectedRouter} from 'connected-react-router';
import {createBrowserHistory} from 'history';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import {Provider} from 'react-redux';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import '@vubiquity-nexus/portal-styles/scss/index.scss';
import AppProviders from './AppProviders';
import Router from './Router';
import {setEnvConfiguration, registerSingleSpaApps} from './config';
import {routesWithTracking} from './routes';
import rootSaga from './saga';
import configureStore from './store';
import {configurePersistor} from './store-persist-config';
import {initializeTracker} from './util/hoc/withTracker';
import './styles/legacy/bootstrap.scss'; // TODO: remove
import './styles/legacy/WeAre138.scss'; // TODO: lovely file name - remove
import './styles/legacy/global.scss'; // TODO; refactor

const AG_GRID_LICENSE_KEY =
    'QBS_Software_Ltd_on_behalf_of_Vubiquity_Management_Limited_MultiApp_4Devs25_October_2020__MTYwMzU4MDQwMDAwMA==3193ab7c187172f4a2aac1064f3d8074';
LicenseManager.setLicenseKey(AG_GRID_LICENSE_KEY);

// setEnvConfiguration('qa')
setEnvConfiguration()
    .then(() => renderApp())
    .catch(error => {
        // eslint-disable-next-line
        console.error(error);
        render(<p>Problem with configuration, application cannot be started</p>, document.querySelector('#app'));
    });

const history = createBrowserHistory();

// temporary export -> we should not export store
// eslint-disable-next-line no-underscore-dangle
export const store = configureStore(window.__PRELOADED_STATE__ || {}, history);
const persistor = configurePersistor(store);

// eslint-disable-next-line
delete window.__PRELOADED_STATE__;

const App = ({importMap}) => (
    <AppContainer>
        <Provider store={store}>
            <AppProviders persistor={persistor}>
                <ConnectedRouter history={history}>
                    <ErrorBoundary>
                        <Toast />
                        <NexusLayout>
                            <Router routes={routesWithTracking(importMap)} />
                        </NexusLayout>
                    </ErrorBoundary>
                </ConnectedRouter>
            </AppProviders>
        </Provider>
    </AppContainer>
);

App.propTypes = {
    importMap: PropTypes.object,
};

App.defaultProps = {
    importMap: {},
};

function renderApp() {
    createKeycloakInstance();
    initializeTracker();
    store.runSaga(rootSaga);
    registerSingleSpaApps().then(importMap => {
        render(<App importMap={importMap} />, document.getElementById('app'));
    });
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
