import config from 'react-global-configuration';
import Http from '../../../util/Http';

const http = Http.create({noDefaultErrorHandling: true});

export const deleteConfigItemById = (urlBase, field, id) => {
    let path = field + '/' + id;
    return http.delete(config.get('gateway.configuration') + urlBase + path);
};
