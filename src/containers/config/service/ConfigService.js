import config from 'react-global-configuration';
import Http from '../../../util/Http';

const http = Http.create({defaultErrorHandling: false});
const httpWithDefaultErrorHandling = Http.create();

export const loadConfigAPIEndPoints = () => {
    return http.get(config.get('gateway.configuration') + config.get('gateway.service.configuration') + '/endpoints');
};

export const configService = {
    create: (endpoint, rec) => {
        return httpWithDefaultErrorHandling.post(config.get('gateway.configuration') + config.get('gateway.service.configuration') + '/' + endpoint, rec);
    },

    update: (endpoint, id, rec) => {
        return httpWithDefaultErrorHandling.put(config.get('gateway.configuration') + config.get('gateway.service.configuration') + `/${endpoint}/${id}`, rec);
    },

    delete: (endpoint, id) => {
        return httpWithDefaultErrorHandling.delete(config.get('gateway.configuration') + config.get('gateway.service.configuration') + `/${endpoint}/${id}`);
    }
};
