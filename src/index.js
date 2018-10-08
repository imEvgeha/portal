import './bootstrap.scss'
// import './bootstrap-theme.scss'
import './WeAre138.scss'
import './global.scss'

import React from 'react'
import {render} from 'react-dom'
import { Provider } from 'react-redux'

import Keycloak from './util/keycloak'
import store from './stores/index'

import App from './containers/App'
import {loadProfileInfo} from "./actions";

const keycloakConfig = {
    "clientId": "vehicle-ui-client",
    "realm": "Vubiquity",
    "auth-server-url": "http://usla-amm-d001.dev.vubiquity.com:8080/auth",
    "url": "http://usla-amm-d001.dev.vubiquity.com:8080/auth",
    "ssl-required": "external",
    "resource": "vehicle-ui-clientc",
    // "credentials": {
    //     "secret": "8d010863-9e07-494d-b801-b345a3d2abee"
    // },
    "credentials": {
        "secret": "487cade0-d8d2-4629-9450-fa2d93050edd"
    },
    "use-resource-role-mappings": true,
    "confidential-port": 0,
    "policy-enforcer": {}
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
            store.subscribe( () => console.log('Look me'));
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


