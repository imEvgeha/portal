import config from 'react-global-configuration';
import Http from '../util/Http';

const http = Http.create({defaultErrorHandling: false});

export const getConfigApiValues = (configUrl, page, size, sortBy, field, searchValue) => {
    const sortPath = sortBy ? ';'+ sortBy +'=ASC' : '';
    const searchBy = searchValue ? `${field}=${searchValue}&` : '';

    const path = `${configUrl}${sortPath}?${searchBy}page=${page}&size=${size}`;
    return http.get(config.get('gateway.configuration') + config.get('gateway.service.configuration') + '/' + path);
};