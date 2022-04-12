import {get, isObject, merge} from 'lodash';
import {defaultConfiguration} from '../../../src/config';
import {nexusFetch} from './http-client';

let configuration = {};

// temporary solution - replace it with env variables
export async function loadConfig(configFile) {
    try {
        configuration = merge(configuration, defaultConfiguration);

        const data = await nexusFetch(configFile);

        if (isObject(data)) {
            configuration = merge(configuration, data);
            return true;
        }
        return JSON.parse(data);
    } catch (error) {
        throw error;
    }
}

export const getConfig = key => get(configuration, key);
export const setConfig = configObject => merge(configuration, configObject);

export const getAuthConfig = () => {
    const kConfig = getConfig('keycloak');
    const realm = window.location.pathname.split('/')[1];
    return {...kConfig, realm};
};
