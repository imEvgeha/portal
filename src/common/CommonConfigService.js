import config from 'react-global-configuration';
import Http from '../util/Http';

const http = Http.create({noDefaultErrorHandling: true});

export const getConfigApiValues = (urlApi, page, size, sortBy, field, searchValue) => {
    let sortPath = sortBy ? ';'+ sortBy +'=ASC' : '';
    let searchBy = searchValue ? `${field}=${searchValue}&` : '';

    let path = `${urlApi}${sortPath}?${searchBy}page=${page}&size=${size}`;
    return http.get(config.get('gateway.configuration') + config.get('gateway.service.configuration') + '/' + path);
};