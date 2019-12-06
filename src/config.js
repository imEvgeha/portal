export const defaultConfiguration = {
    gateway: {
        url: 'https://availsapi.dev.vubiquity.com',
        availsParserUrl: 'https://avails-parser.dev.vubiquity.com',
        titleUrl: 'https://titlesapi.dev.vubiquity.com',
        configuration: 'https://configapi.dev.vubiquity.com',
        assetManagementURL: 'https://asset-management-api.dev.vubiquity.com',
        eventApiUrl: 'https://eventapi.dev.vubiquity.com',
        service: {
            avails: '/avails-api/v1',
            availsParser: '/avails-parser/v1', 
            title: '/titles-api/v1',
            configuration: '/configuration-api/v1',
            assetManagement: '/api/asset-management/v1',
            eventApi: '/api/event-api/v1'
        },
    },
    avails: {
        upload: {
            http: {
                timeout: 600000
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
