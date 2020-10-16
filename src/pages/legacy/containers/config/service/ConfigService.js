import config from 'react-global-configuration';
import {nexusFetch} from '../../../../../util/http-client/index';

export const loadConfigAPIEndPoints = () => {
    const url = config.get('gateway.configuration') + config.get('gateway.service.configuration') + '/endpoints';
    return nexusFetch(url, {isWithErrorHandling: false});
};

export const configService = {
    create: (endpoint, data) => {
        const url = config.get('gateway.configuration') + config.get('gateway.service.configuration') + '/' + endpoint;
        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(data),
        });
    },

    update: (endpoint, id, data) => {
        const url =
            config.get('gateway.configuration') + config.get('gateway.service.configuration') + `/${endpoint}/${id}`;
        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(data),
        });
    },

    delete: (endpoint, id) => {
        const url =
            config.get('gateway.configuration') + config.get('gateway.service.configuration') + `/${endpoint}/${id}`;
        return nexusFetch(url, {
            method: 'delete',
        });
    },
};
