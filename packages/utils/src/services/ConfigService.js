import {getApiURI} from '../config';
import {nexusFetch} from '../http-client';

export const loadConfigAPIEndPoints = () => {
    const uri = `/endpoints`;
    const url = getApiURI('configuration', uri);

    return nexusFetch(url, {isWithErrorHandling: false});
};

export const configService = {
    get: (endpoint, id) => {
        const uri = `/${endpoint}/${id}`;
        const url = getApiURI('configuration', uri);

        return nexusFetch(url);
    },

    create: (endpoint, data) => {
        const uri = `/${endpoint}`;
        const url = getApiURI('configuration', uri);

        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(data),
        });
    },

    update: (endpoint, id, data) => {
        const uri = `/${endpoint}/${id}`;
        const url = getApiURI('configuration', uri);

        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(data),
        });
    },

    delete: (endpoint, id) => {
        const uri = `/${endpoint}/${id}`;
        const url = getApiURI('configuration', uri);

        return nexusFetch(url, {
            method: 'delete',
        });
    },
};
