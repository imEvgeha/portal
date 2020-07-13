import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Keycloak from 'keycloak-js';
import {createBrowserHistory} from 'history';
import {AppContainer} from 'react-hot-loader'; 
import {ConnectedRouter} from 'connected-react-router';
import {LicenseManager} from 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {defaultConfiguration, setEnvConfiguration} from './config';
import './styles/index.scss';
import './styles/legacy/bootstrap.scss'; // TODO: remove
import './styles/legacy/WeAre138.scss'; // TODO: lovely file name - remove
import './styles/legacy/global.scss'; // TODO; refactor
import configureStore from './store';
import rootSaga from './saga';
import NexusLayout from './ui/elements/nexus-layout/NexusLayout';
import CustomIntlProvider from './ui/elements/nexus-layout/CustomIntlProvider';
import {isObject, mergeDeep} from './util/Common';
import {NexusModalProvider} from './ui/elements/nexus-modal/NexusModal';
import {NexusOverlayProvider} from './ui/elements/nexus-overlay/NexusOverlay';
import {login, authRefreshToken, storeAuthCredentials, injectUser} from './auth/authActions';
import Toast from './ui/toast/Toast';
import {keycloak, createKeycloakInstance} from './auth/keycloak';
import {configurePersistor} from './store-persist-config';
import AuthProvider from './auth/AuthProvider';
import { routesWithTracking } from './routes';
import Router from './Router';
import AppProviders from './AppProviders';
import { initializeTracker } from './util/hoc/withTracker';

const AG_GRID_LICENSE_KEY = 'QBS_Software_Ltd_on_behalf_of_Vubiquity_Management_Limited_MultiApp_4Devs25_October_2020__MTYwMzU4MDQwMDAwMA==3193ab7c187172f4a2aac1064f3d8074';
LicenseManager.setLicenseKey(AG_GRID_LICENSE_KEY);

// setEnvConfiguration('qa')
setEnvConfiguration()
    .then(() => renderApp())
    .catch(error => {
        console.error(error); // eslint-disable-line
        render(
            <p>Problem with configuration, application cannot be started</p>,
            document.querySelector('#app')
        );
    });

const history = createBrowserHistory();

// temporary export -> we should not export store
export const store = configureStore(window.__PRELOADED_STATE__ || {}, history);
const persistor = configurePersistor(store);

delete window.__PRELOADED_STATE__; // eslint-disable-line 

const App = () => (
    <AppContainer>
        <Provider store={store}>
            <AppProviders persistor={persistor}>
                <ConnectedRouter history={history}>
                    <>
                        <Toast />
                        <NexusLayout>
                            <Router routes={routesWithTracking()} />
                        </NexusLayout>
                    </>
                </ConnectedRouter>
            </AppProviders>
        </Provider>
    </AppContainer>
);

function renderApp() {
    createKeycloakInstance();
    initializeTracker();
    store.runSaga(rootSaga);
    render(
        <App />,
        document.getElementById('app')
    );

};

if (module.hot) {
    module.hot.accept(
         ([
            // TODO: we should enable AppProviders too
            './ui/elements/nexus-layout/NexusLayout', 
            './Router',
            './routes',
            './saga',
        ])
        , () => {
            render(
                <App />,
                document.getElementById('app')
            );
    });
}
