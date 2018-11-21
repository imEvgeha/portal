import './bootstrap.scss';
import './WeAre138.scss';
import './global.scss';
import axios from 'axios';
import config from 'react-global-configuration';
import {defaultConfiguration} from './config';

config.set(defaultConfiguration, {freeze: false});
axios.get('config.json').then(response => {
    config.set(response.data, {assign: true, freeze: true});
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
import store from './stores/index';

import App from './containers/App';
import {loadProfileInfo} from './actions';
import {loadState} from './stores';

export const keycloak = {instance: {}};
function init() {
    keycloak.instance = Keycloak(config.get('keycloak'));
    keycloak.instance.init({onLoad: 'check-sso'}).success(authenticated => {
        if (authenticated) {
            setInterval(() => {
                keycloak.instance.updateToken(10).error(() => keycloak.logout());
            }, 10000);

            keycloak.instance.loadUserInfo().success(profileInfo => {
                store.dispatch(loadProfileInfo(profileInfo));
                loadState();
            });

            render(
                <Provider store={store}>
                    <App/>
                </Provider>,
                document.querySelector('#app')
            );
        } else {
            keycloak.instance.login();
        }

    });
}