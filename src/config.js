import config from 'react-global-configuration';
import {registerApplication} from 'single-spa';
import {can} from './ability';
import {isObject, mergeDeep} from './util/Common';
import {nexusFetch} from './util/http-client';

export const defaultConfiguration = {
    gateway: {
        url: 'https://availsapi.dev.vubiquity.com',
        availsParserUrl: 'https://avails-parser.dev.vubiquity.com',
        titleUrl: 'https://titlesapi.dev.vubiquity.com',
        configuration: 'https://configapi.dev.vubiquity.com',
        assetManagementURL: 'https://asset-management-api.dev.vubiquity.com',
        eventApiUrl: 'https://eventapi.dev.vubiquity.com',
        servicingOrdersUrl: 'https://service-order-manager.dev.vubiquity.com',
        service: {
            avails: '/avails-api/v1',
            availsParser: '/avails-parser/v1',
            title: '/titles-api/v1',
            configuration: '/configuration-api/v1',
            assetManagement: '/api/asset-management/v1',
            eventApi: '/api/event-api/v1',
            eventApiV2: '/api/event-api/v2',
            servicingOrder: '',
        },
    },
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
        clientId: 'temportalapp-dev',
        realm: 'Vubiquity',
        url: 'https://auth.dev.vubiquity.com/auth',
        'ssl-required': 'external',
        'use-resource-role-mappings': true,
        'confidential-port': 0,
    },
    googleAnalytics: {
        propertyId: 'UA-165264495-2',
    },
};

// temporary solution - replace it with env variables
export async function setEnvConfiguration(env) {
    const getConfigFile = env => {
        switch (env) {
            case 'dev':
                return '/config.json';
            case 'qa':
                return '/configQA.json';
            default:
                return '/config.json';
        }
    };
    try {
        config.set(defaultConfiguration, {freeze: false});

        const configFile = getConfigFile(env);
        const data = await nexusFetch(configFile);

        if (isObject(data)) {
            config.set(mergeDeep(JSON.parse(config.serialize()), data), {freeze: false});
            return true;
        }
        return JSON.parse(data);
    } catch (error) {
        throw error;
    }
}

// App config
export const appConfig = {
    // General
    VERSION: process.env.VERSION,
    BUILD: process.env.BUILD,
    ENVIRONMENT: process.env.NODE_ENV,
    ROOT: '/',
    BASE_URL: process.env.BASE_URI,
    LOCALE: process.env.LOCALE || 'en',
};

// Single Spa Apps registration
// child-app names needs to be of the format: "@portal-mf/event-management"
export const registerSingleSpaApps = async () => {
    let importMap = {};
    await nexusFetch('/importMap.json').then(map => {
        importMap = map;
        Object.keys(map.imports).map(name => {
            if (name.includes('portal-mf')) {
                registerApplication({
                    name,
                    app: () => System.import(name),
                    activeWhen: name.split('portal-mf')[1],
                    customProps: {nexusFetch, can},
                });
            }
        });
    });
    return importMap;
};
