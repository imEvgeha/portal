import config from 'react-global-configuration';
import Http from '../../../util/Http';

const http = Http.create({noDefaultErrorHandling: true});

export const loadConfigAPIEndPoints = () => {
    return http.get(config.get('gateway.configuration') + config.get('gateway.service.configuration') + '/endpoints');
};

export const configService = {
    create: (endpoint, rec) => {
        return http.post(config.get('gateway.configuration') + config.get('gateway.service.configuration') + '/' + endpoint, rec);
    },

    update: (endpoint, id, rec) => {
        return http.put(config.get('gateway.configuration') + config.get('gateway.service.configuration') + `/${endpoint}/${id}`, rec);
    },

    delete: (endpoint, id) => {
        return http.delete(config.get('gateway.configuration') + config.get('gateway.service.configuration') + `/${endpoint}/${id}`);
    }
};
