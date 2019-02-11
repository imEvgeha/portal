export const defaultConfiguration = {
    gateway: {
        url: 'https://availsapi.dev.vubiquity.com',
        titleUrl: 'http://localhost:8090',
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
                timeout: 30000
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
        }
    },
    keycloak: {
        'clientId': 'temportalapp-dev',
        'realm': 'Vubiquity',
        'url': 'https://auth.dev.vubiquity.com/auth',
        'ssl-required': 'external',
        'use-resource-role-mappings': true,
        'confidential-port': 0
    },
    extraValidation: {
        resolution: {
            type: 'oneOf',
            fields: ['sd', 'hd', 'f3d', 'f4k'],
            values: [['SD'], ['HD'], ['3D'], ['4K/UHD']]
        }
    }
};
