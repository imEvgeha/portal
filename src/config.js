export const defaultConfiguration = {
    gateway: {
        url: 'https://availsapi.dev.vubiquity.com',
        titleUrl: 'http://localhost:8082',
        configuration: 'https://configapi.dev.vubiquity.com',
        service: {
            avails: '/avails-api/v1',
            title: '/titles-api/v1',
            configuration: '/configuration-api/v1',
        },
    },
    avails: {
        upload: {
            http: {
                timeout: 120000
            },
            extensions: '.xls, .xlsx'
        },
        export: {
            http: {
                timeout: 120000
            },
        },
        page: {
            size: 100
        },
        edit:{
            refresh: {
                interval: 60000
            }
        }
    },
    title: {
        page: {
            size: 100
        }
    },
    keycloak: {
        'clientId': 'temportalapp-dev',
        'realm': 'Vubiquity',
        'url': 'https://auth.dev.vubiquity.com/auth',
        'ssl-required': 'external',
        'use-resource-role-mappings': true,
        'confidential-port': 0
    }
};
