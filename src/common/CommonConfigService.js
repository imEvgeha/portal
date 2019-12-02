import config from 'react-global-configuration';
import Http from '../util/Http';

const http = Http.create({defaultErrorHandling: false});

export const getConfigApiValues = (configUrl, page, size, sortBy, field, searchValue) => {
    let sortPath = sortBy ? ';'+ sortBy +'=ASC' : '';
    let searchBy = searchValue ? `${field}=${searchValue}&` : '';

    let path = `${configUrl}${sortPath}?${searchBy}page=${page}&size=${size}`;
    return http.get(config.get('gateway.configuration') + config.get('gateway.service.configuration') + '/' + path);
};