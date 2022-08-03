import parse from 'json-templates';
import {get, merge} from 'lodash';
import {nexusFetch} from './http-client';

let configuration = {};

let environment = 'dev';

const setEnv = env => (environment = env);

// temporary solution - replace it with env variables
export async function loadConfig(configFile = '/config.json', endpointFile) {
    try {
        const data = await nexusFetch(configFile);
        setEnv(data.subdomain);
        const template = parse(merge(configuration, endpointFile));
        configuration = template({subdomain: environment});
        return configuration;
    } catch (error) {
        throw error;
    }
}

export const getApiURI = (service, uri = '', version = undefined, integrationPoint = undefined) => {
    const {integrationPoints, defaultVersion, defaultIntegrationPoint, services} = configuration;

    const serviceIntegrationPoint =
        integrationPoint || services?.[service]?.integrationPoint || defaultIntegrationPoint;
    const integrateWith = integrationPoints?.[serviceIntegrationPoint]?.baseURL;
    const apiVersion = version ?? defaultVersion;
    const serviceURI = services?.[service]?.baseURI;

    if (integrateWith) {
        if (serviceURI) {
            const availableVersions = services[service]?.versions;
            if (version && version !== defaultVersion && !availableVersions?.includes(version)) {
                // Disable warning as it is needed for development
                // eslint-disable-next-line no-console
                console.error(
                    `Version provided "${version}" for "${service}" was not found in available versions of service. Please update configuration`
                );
            }

            return `${integrateWith}${serviceURI}${apiVersion ? `/v${apiVersion}` : ''}${uri}`;
        }
        // Disable warning as it is needed for development
        // eslint-disable-next-line no-console
        console.error(`Service URI "${serviceURI}" not found. Please check configuration`);
    } else {
        // Disable warning as it is needed for development
        // eslint-disable-next-line no-console
        console.error(`Integration Point "${integrateWith}" not found. Please check configuration`);
    }
    return '';
};

export const getConfig = key => get(configuration, key);
export const setConfig = configObject => merge(configuration, configObject);

export const getAuthConfig = () => {
    const kConfig = getConfig('sso');
    const realm = window.location.pathname.split('/')[1];
    return {...kConfig, realm};
};
