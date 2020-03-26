import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import Keycloak from 'keycloak-js';
import axios from 'axios';
import config from 'react-global-configuration';
import {createBrowserHistory} from 'history';
import {defaultConfiguration} from './config';
import './styles/index.scss';
import './bootstrap.scss'; // TODO: remove this
import './WeAre138.scss'; // TODO: file name ???
import './global.scss'; // TODO; refactor this
import configureStore from './store';
import rootSaga from './saga';
import {loadDashboardState, loadHistoryState, loadCreateRightState, loadDopState, loadManualRightEntryState} from './stores/index';
import AppLayout from './layout/AppLayout';
import {isObject, mergeDeep} from './util/Common';
import {updateAbility} from './ability';
import {NexusModalProvider} from './ui/elements/nexus-modal/NexusModal';
import {NexusOverlayProvider} from './ui/elements/nexus-overlay/NexusOverlay';
import CustomIntlProvider from './layout/CustomIntlProvider';
import {authRefreshToken, storeAuthCredentials, injectUser} from './auth/authActions';
import {getAccessToken, getRefreshToken} from './auth/authService';
import {loadProfileInfo} from './stores/actions';
import Toast from './ui/toast/Toast';
import jwtDecode from 'jwt-decode';
import {initalizeKeycloak, refreshUserToken} from './auth/keycloak';

config.set(defaultConfiguration, {freeze: false});

// set environment variables
// axios.get('/configQA.json').then(response => {
axios.get('/config.json').then(response => {
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


const TEMP_AUTH_UPDATE_TOKEN_INTERVAL = 10000;
const history = createBrowserHistory();
// temporary export -> we should not export store
export const store = configureStore({}, history);

const appContent = (
    <Provider store={store}>
        <CustomIntlProvider>
            <NexusOverlayProvider>
                <NexusModalProvider>
                    <>
                        <Toast />
                        <AppLayout history={history} />
                    </>
                </NexusModalProvider>
            </NexusOverlayProvider>
        </CustomIntlProvider>
    </Provider>
);

const renderApp = (keycloak) => {
    const {realmAccess, token, refreshToken} = keycloak;
    const {roles} = realmAccess || {};
    store.runSaga(rootSaga);
    store.dispatch(injectUser({accessToken: token, refreshToken}));
    keycloak.loadUserProfile().then(userAccount => {
        store.dispatch(injectUser({userAccount}));
    });
    loadDashboardState(); // TODO: to remove 
    loadCreateRightState(); // TODO: to remove 
    loadHistoryState(); // TODO: to remove
    loadDopState(); // TODO: to remove
    updateAbility(roles);
    render(
        appContent,
        document.querySelector('#app')
    );
    refreshUserToken()
        .then(isRefreshed => {
            console.log(isRefreshed, 'is refreshed');
        })
        .catch(() => store.dispatch(logout({keycloak})));
};

function init() {
    const token = getAccessToken();
    const refreshToken = getRefreshToken(); 
    const test = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJYLUJHaXZLMmFRVHFDdVpOUk5PM3o3dXZQWHZxcTdqTFpkaGpBWGI3bF9JIn0.eyJqdGkiOiJlZmY1NGQ5Ni1kYzkwLTQ5YjgtOWQxOC02YmQ5MjVjMjUzMzkiLCJleHAiOjE1ODUyMjI1MTMsIm5iZiI6MCwiaWF0IjoxNTg1MjE5NTEzLCJpc3MiOiJodHRwczovL2F1dGguZGV2LnZ1YmlxdWl0eS5jb20vYXV0aC9yZWFsbXMvVnViaXF1aXR5IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjAzZDkxNmEwLWYxMjQtNGUwMC1iMGM2LWIzNjFhM2U2N2VmZSIsInR5cCI6IkJlYXJlciIsImF6cCI6InRlbXBvcnRhbGFwcC1kZXYiLCJub25jZSI6Ijg4ZTM4MTBhLTZjMmYtNGQxZS1hYmI3LTJmZDgxMjQwMDU4NiIsImF1dGhfdGltZSI6MTU4NTIxNTQxOCwic2Vzc2lvbl9zdGF0ZSI6ImRlYjhkMjU3LWVkNGEtNGZlOS1iMjgwLTliYzFjNDA0YWMxMiIsImFjciI6IjAiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiYXNzZXRfbWFuYWdlbWVudF92aWV3ZXIiLCJhdmFpbHNfdmlld2VyIiwiY29uZmlndXJhdGlvbl91c2VyIiwidnVfYXBpX3VzZXIiLCJhc3NldF9tYW5hZ2VtZW50X3VzZXIiLCJhdmFpbHNfdXNlciIsImNvbmZpZ3VyYXRpb25fdmlld2VyIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6Ik1pbG9zIEFkemljIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibWFkemljIiwiZ2l2ZW5fbmFtZSI6Ik1pbG9zIiwiZmFtaWx5X25hbWUiOiJBZHppYyIsImVtYWlsIjoibWlsb3MuYWR6aWNAY29tcHV0ZXJyb2NrLmNvbSJ9.GUfn4sLcpwP8N5hYPXkuY_3-TyZI24H5LsxkvmGR6usbv2p9ckCDMd8bwybuZE6HHwNvhzsvdsx8XODqk1gjpsW_pnzFz2kjrE9MtDvB5X-nZ0CiU5jL_4szCFmdN3BJElPFOHJ0R0ly1tLp1Mm3LPfPn3_a7vPsuW2Fn4td7qgEM0c4CrEK9qKiePvHrMGxGhzC4pVkI7mLQvM587KxrzPNE06PUP01Ta_koWTMiBwdNaus7ReDTDtLp7_WEgMEDhp5ljrkABdvIigA5P-lxwWQPeR4balVtm8EJleyY3YrtZFHYM1GZDzCPHXsvkPGqP8SVz22vXyfSYqdp97Gdg';
    initalizeKeycloak({token, refreshToken}).then(keycloak => {
        renderApp(keycloak);
    });
}

