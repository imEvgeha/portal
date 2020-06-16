import Keycloak from 'keycloak-js';
import config from 'react-global-configuration';

export let keycloak = {};

export const createKeycloakInstance = () => {
    keycloak = new Keycloak(config.get('keycloak'));
};

export const KEYCLOAK_INIT_OPTIONS = {
    onLoad: 'login-required',
    promiseType: 'native',
    checkLoginIframe: false  // Fix for Safari infinite loop: https://github.com/dasniko/keycloak-reactjs-demo/issues/3
};
