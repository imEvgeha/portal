import config from 'react-global-configuration';
import Http from '../../../util/Http';

const http = Http.create({noDefaultErrorHandling: true});

export const deleteConfigItemById = (field, id) => {
    let path = field + '/' + id;
    return http.delete(config.get('gateway.configuration') + config.get('gateway.service.configuration') + '/' + path);
};

export const loadConfigAPIEndPoints = () => {
    return http.get(config.get('gateway.configuration') + config.get('gateway.service.configuration') + '/endpoints');
};