import Keycloak from 'keycloak-js';

// eslint-disable-next-line import/no-mutable-exports
export let keycloak = {};

export const createKeycloakInstance = keycloakConfig => {
    keycloak = new Keycloak(keycloakConfig);
};

export const KEYCLOAK_INIT_OPTIONS = {
    onLoad: 'login-required',
    promiseType: 'native',
    checkLoginIframe: false, // Fix for Safari infinite loop: https://github.com/dasniko/keycloak-reactjs-demo/issues/3
};
