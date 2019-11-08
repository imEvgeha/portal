import Keycloak from 'keycloak-js';
import config from 'react-global-configuration';

const KEYCLOAK_INIT_OPTIONS = {
    onLoad: 'check-sso',
    promiseType: 'native',
};

export default class KeycloakAuth {
    constructor() {
        this.keycloak = new Keycloak(config.get('keycloak'));
    }

    get keycloakIntance() {
        return this.keycloak;
    }

    get profileInfo() {
        return new Promise((resolve, reject) => {
            return this.keycloak.loadUserInfo()
            .then(profileInfo => resolve(profileInfo))
            .catch(error => reject(error));
        });
    }

    setKeycloakAuth(options) {
        return new Promise((resolve, reject) => {
            this.keycloak.init(options)
                .then(authenticated => {
                    if (authenticated) {
                        resolve(authenticated);
                    }
                    reject(authenticated);
                })
                .catch(error => reject(error));
            });
    }

    refreshTokens(minValidity = 5) {
        return new Promise((resolve, reject) => {
            this.keycloak.updateToken(minValidity)
                .then(refreshed => {
                    if (refreshed) {
                        resolve(refreshed);   
                    }
                    resolve(refreshed);
                })
                .catch(error => reject(error));
        });
    }

    static logout() {
        this.keycloak.logout();
    }
}

