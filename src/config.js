export const defaultConfiguration = {
    gateway: {
        url: 'http://availsapi.dev.vubiquity.com'
    },
    base: {
        path: '/avails-api/v1'
    },
    avails: {
        upload: {
            http: {
                timeout: 30000
            },
            extensions: '.xls, .xlsx'
        },
        page: {
            size: 100
        }
    },
    keycloak: {
        'clientId': 'vehicle-public',
        'realm': 'Vubiquity',
        'auth-server-url': 'http://auth.dev.vubiquity.com/auth',
        'url': 'http://authdev.vubiquity.com:8080/auth',
        'ssl-required': 'external',
        'use-resource-role-mappings': true,
        'confidential-port': 0,
        'policy-enforcer': {}
    }
};