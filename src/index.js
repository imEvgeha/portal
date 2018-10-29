import './bootstrap.scss';
import './WeAre138.scss';
import './global.scss';

import axios from 'axios';
import config from 'react-global-configuration';
import {defaultConfiguration} from './config';

config.set(defaultConfiguration, {freeze: false});
axios.get('config.js').then(response => {
    config.set(response, {assign: true, freeze: true});
}).catch(() =>
    console.warn('Unexpected Error during load environment configuration')
);

import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';

import Keycloak from './vendor/keycloak';
import store from './stores/index';

import App from './containers/App';
import {loadProfileInfo} from './actions';



export const keycloak = Keycloak(config.get('keycloak'));

keycloak.init({onLoad: 'check-sso'}).success(authenticated => {
    if (authenticated) {
        setInterval(() => {
            keycloak.updateToken(10).error(() => keycloak.logout());
        }, 10000);

        keycloak.loadUserInfo().success(profileInfo => {
            store.dispatch( loadProfileInfo(profileInfo));
            store.username = profileInfo.username;
        }) ;

        render(
            <Provider store={store}>
                <App/>
            </Provider>,
            document.querySelector('#app')
        );
    } else {
        keycloak.login();
    }

});

export const GATEWAY_URL = config.get('gateway.url');
export const BASE_PATH = '/avails-api/v1';
export const BASE_URL = GATEWAY_URL + config.get('base.path');