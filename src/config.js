export const defaultConfiguration = {
    avails: {
        upload: {
            http: {
                timeout: 600000,
            },
            extensions: '.xls, .xlsx',
        },
        export: {
            http: {
                timeout: 120000,
            },
        },
        page: {
            size: 100,
        },
        edit: {
            refresh: {
                interval: 60000,
            },
        },
    },
    title: {
        page: {
            size: 100,
        },
    },
    keycloak: {
        'ssl-required': 'external',
        'use-resource-role-mappings': true,
        'confidential-port': 0,
    },
};
