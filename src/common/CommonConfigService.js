import config from 'react-global-configuration';
import Http from '../util/Http';

const http = Http.create({noDefaultErrorHandling: true});

export const getConfigApiValues = (urlBase, field, page, size, sortBy) => {
    let sortPath = sortBy ? ';'+ sortBy +'=ASC' : '';
    let path = field + sortPath + '?page=' + page + '&size='+ size;
    return http.get(config.get('gateway.configuration') + urlBase + path);
};