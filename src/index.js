import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Keycloak from 'keycloak-js';
import {createBrowserHistory} from 'history';
import {defaultConfiguration, setEnvConfiguration} from './config';
import './styles/index.scss';
import './styles/legacy/bootstrap.scss'; // TODO: remove
import './styles/legacy/WeAre138.scss'; // TODO: lovely file name - remove
import './styles/legacy/global.scss'; // TODO; refactor
import configureStore from './store';
import rootSaga from './saga';
import NexusLayout from './ui/elements/nexus-layout/NexusLayout';
import CustomIntlProvider from './layout/CustomIntlProvider';
import {isObject, mergeDeep} from './util/Common';
import {NexusModalProvider} from './ui/elements/nexus-modal/NexusModal';
import {NexusOverlayProvider} from './ui/elements/nexus-overlay/NexusOverlay';
import {login, authRefreshToken, storeAuthCredentials, injectUser} from './auth/authActions';
import Toast from './ui/toast/Toast';
import {keycloak, createKeycloakInstance} from './auth/keycloak';
import {configurePersistor} from './store-persist-config';
import AuthProvider from './auth/AuthProvider';
import {
    loadDashboardState,
    loadHistoryState,
    loadCreateRightState,
    loadDopState,
    loadManualRightEntryState
} from './pages/legacy/stores/index'; // TODO: remove 
import {loadProfileInfo} from './pages/legacy/stores/actions'; // TODO: remove

setEnvConfiguration('qa')
// setEnvConfiguration()
    .then(() => renderApp())
    .catch(error => {
        console.error(error, 'error');
        render(
            <p>Problem with configuration, application cannot be started</p>,
            document.querySelector('#app')
        );
    });

const history = createBrowserHistory();
// temporary export -> we should not export store
export const store = configureStore({}, history);
const persistor = configurePersistor(store);

const appContent = (
    <Provider store={store}>
        <CustomIntlProvider>
            <NexusOverlayProvider>
                <NexusModalProvider>
                    <PersistGate loading={null} persistor={persistor}>
                        <AuthProvider>
                            <Toast />
                            <NexusLayout history={history} />
                        </AuthProvider>
                    </PersistGate>
                </NexusModalProvider>
            </NexusOverlayProvider>
        </CustomIntlProvider>
    </Provider>
);

function renderApp () {
    createKeycloakInstance();
    store.runSaga(rootSaga);
    render(
        appContent,
        document.querySelector('#app')
    );
};
