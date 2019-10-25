import axios from 'axios';
import config from 'react-global-configuration';
import {createBrowserHistory} from 'history';
import {defaultConfiguration} from './config';
import './styles/index.scss';
import './bootstrap.scss'; // TODO: remove this
import './WeAre138.scss'; // TODO: file name ???
import './global.scss'; // TODO; refactor this

config.set(defaultConfiguration, {freeze: false});

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

import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';

import Keycloak from './vendor/keycloak';
import configureStore from './store';
import rootSaga from './saga';
import {loadDashboardState, loadHistoryState, loadCreateRightState, loadDopState} from './stores/index';

import AppLayout from './layout/AppLayout';
import {loadProfileInfo} from './stores/actions';
import {isObject, mergeDeep} from './util/Common';
import {updateAbility} from './ability';
import CustomIntlProvider from './layout/CustomIntlProvider';

export const keycloak = {instance: {}};
const TEMP_AUTH_UPDATE_TOKEN_INTERVAL = 10000;
const history = createBrowserHistory();
// temporary export -> we should not export store
export const store = configureStore({}, history);

const app = (
    <Provider store={store}>
        <CustomIntlProvider>
            <AppLayout history={history} />
        </CustomIntlProvider>
    </Provider>
);

function init() {
    keycloak.instance = Keycloak(config.get('keycloak'));
    keycloak.instance.init({onLoad: 'check-sso'}).success(authenticated => {
        if (authenticated) {
            setInterval(() => {
                keycloak.instance.updateToken(10).error(() => keycloak.instance.logout());
            }, TEMP_AUTH_UPDATE_TOKEN_INTERVAL);

            keycloak.instance.loadUserInfo().success(profileInfo => {
                store.runSaga(rootSaga);
                store.dispatch(loadProfileInfo(profileInfo));
                loadDashboardState();
                loadCreateRightState();
                loadHistoryState();
                loadDopState();

                render(
                    app,
                    document.querySelector('#app')
                );
            });
            updateAbility(keycloak.instance);

            return;
        } 
        keycloak.instance.login();
    });
}
