import './bootstrap.scss';
// import './bootstrap-theme.scss'
import './WeAre138.scss';
import './global.scss';

import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';

import Keycloak from './vendor/keycloak';
import store from './stores/index';

import App from './containers/App';
import {loadProfileInfo} from './actions';

const keycloakConfig = {
    'clientId': 'vehicle-public',
    'realm': 'Vubiquity',
    'auth-server-url': 'http://usla-amm-d001.dev.vubiquity.com:8080/auth',
    'url': 'http://usla-amm-d001.dev.vubiquity.com:8080/auth',
    'ssl-required': 'external',
    'use-resource-role-mappings': true,
    'confidential-port': 0,
    'policy-enforcer': {}
};

export const keycloak = Keycloak(keycloakConfig);

keycloak.init({onLoad: 'check-sso'}).success(authenticated => {
    if (authenticated) {
        console.log('LOGGED :) ');
        setInterval(() => {
            keycloak.updateToken(10).error(() => keycloak.logout());
        }, 10000);

        keycloak.loadUserInfo().success(profileInfo => {
            console.log(profileInfo);
            // store.subscribe( () => console.log('Look me'));
            store.dispatch( loadProfileInfo(profileInfo));
            console.log(store.getState());
            store.username = profileInfo.username;
        }) ;

        render(
            <Provider store={store}>
                <App/>
            </Provider>,
            document.querySelector('#app')
        );
    } else {
        console.log('NEED LOGIN :( ');
        keycloak.login();
    }

});