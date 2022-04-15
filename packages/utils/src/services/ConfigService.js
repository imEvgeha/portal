import {getConfig} from '../config';
import {nexusFetch} from '../http-client';

export const loadConfigAPIEndPoints = () => {
    const url = `${getConfig('gateway.configuration') + getConfig('gateway.service.configuration')}/endpoints`;
    return nexusFetch(url, {isWithErrorHandling: false});
};

export const configService = {
    get: (endpoint, id) => {
        const url = `${
            getConfig('gateway.configuration') + getConfig('gateway.service.configuration')
        }/${endpoint}/${id}`;
        return nexusFetch(url);
    },

    create: (endpoint, data) => {
        const url = `${getConfig('gateway.configuration') + getConfig('gateway.service.configuration')}/${endpoint}`;
        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(data),
        });
    },

    update: (endpoint, id, data) => {
        const url = `${
            getConfig('gateway.configuration') + getConfig('gateway.service.configuration')
        }/${endpoint}/${id}`;
        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(data),
        });
    },

    delete: (endpoint, id) => {
        const url = `${
            getConfig('gateway.configuration') + getConfig('gateway.service.configuration')
        }/${endpoint}/${id}`;
        return nexusFetch(url, {
            method: 'delete',
        });
    },
};
