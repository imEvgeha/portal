import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import Keycloak from 'keycloak-js';
import axios from 'axios';
import config from 'react-global-configuration';
import jwtDecode from 'jwt-decode';
import {createBrowserHistory} from 'history';
import {defaultConfiguration} from './config';
import './styles/index.scss';
import './bootstrap.scss'; // TODO: remove this
import './WeAre138.scss'; // TODO: file name ???
import './global.scss'; // TODO; refactor this
import configureStore from './store';
import rootSaga from './saga';
import {loadDashboardState, loadHistoryState, loadCreateRightState, loadDopState} from './stores/index';
import AppLayout from './layout/AppLayout';
import {loadProfileInfo} from './stores/actions';
import {isObject, mergeDeep} from './util/Common';
import {updateAbility} from './ability';
import NexusToastNotificationProvider from './ui-elements/nexus-toast-notification/NexusToastNotificationProvider';
import {NexusModalProvider} from './ui-elements/nexus-modal/NexusModal';
import {NexusOverlayProvider} from './ui-elements/nexus-overlay/NexusOverlay';
import CustomIntlProvider from './layout/CustomIntlProvider';
import {authRefreshToken, storeAuthCredentials} from './auth/authActions';
import {getValidAccessToken} from './auth/authService';

config.set(defaultConfiguration, {freeze: false});

// set environment variables
axios.get('/configQA.json').then(response => {
// axios.get('/config.json').then(response => {
    if (isObject(response.data)) {
        config.set(mergeDeep(JSON.parse(config.serialize()), response.data), {freeze: true});
    } else {
        JSON.parse(response.data);
    }
    init();
}).catch((error) => {
    console.warn('Cannot load environment configuration');
    console.error(error);
    render(
        <p>
           Problem with configuration, application cannot be started
        </p>,
        document.querySelector('#app')
    );
});


import Keycloak from './vendor/keycloak';
import configureStore from './store';
import rootSaga from './saga';
import {loadDashboardState, loadHistoryState, loadCreateRightState, loadDopState, loadManualRightEntryState} from './stores/index';
import AppLayout from './layout/AppLayout';
import {loadProfileInfo} from './stores/actions';
import {isObject, mergeDeep} from './util/Common';
import {updateAbility} from './ability';
import NexusToastNotificationProvider from './ui-elements/nexus-toast-notification/NexusToastNotificationProvider';
import {NexusModalProvider} from './ui-elements/nexus-modal/NexusModal';
import {NexusOverlayProvider} from './ui-elements/nexus-overlay/NexusOverlay';
import CustomIntlProvider from './layout/CustomIntlProvider';

export const keycloak = {instance: {}};
const TEMP_AUTH_UPDATE_TOKEN_INTERVAL = 10000;
const history = createBrowserHistory();
// temporary export -> we should not export store
export const store = configureStore({}, history);

const app = (
    <Provider store={store}>
        <CustomIntlProvider>
            <NexusOverlayProvider>
                <NexusToastNotificationProvider>
                    <NexusModalProvider>
                        <AppLayout history={history} />
                    </NexusModalProvider>
                </NexusToastNotificationProvider>
            </NexusOverlayProvider>
        </CustomIntlProvider>
    </Provider>
);

export let keycloak = {};
const keycloakIntOptions = {
    onLoad: 'check-sso',
    promiseType: 'native',
};

function init() {
    store.runSaga(rootSaga);
    keycloak = new Keycloak(config.get('keycloak'));
    const token = getValidAccessToken();
    if (token) {
        const roles = jwtDecode(token).realm_access.roles;
        updateAbility(roles);
        store.dispatch(storeAuthCredentials());
        store.dispatch(authRefreshToken());
        render(
            app,
            document.querySelector('#app')
        );
        return;
    }
    keycloak.init(keycloakIntOptions)
        .then(authenticated => {
            if (authenticated) {
                const {realmAccess, token, refreshToken} = keycloak;
                const {roles} = realmAccess || {};
                keycloak.loadUserInfo().then(profileInfo => {
                    store.dispatch(storeAuthCredentials({token, refreshToken, profileInfo}));
                });
                loadDashboardState();
                loadCreateRightState();
                loadHistoryState();
                loadDopState();
                loadManualRightEntryState();
                updateAbility(roles);
                store.dispatch(authRefreshToken());
                render(
                    app,
                    document.querySelector('#app')
                );
            } 
            // keycloak.login();
        });
}
