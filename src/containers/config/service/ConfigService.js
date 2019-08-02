import config from 'react-global-configuration';
import Http from '../../../util/Http';

const http = Http.create({noDefaultErrorHandling: true});

export const deleteConfigItemById = (urlBase, field, id) => {
    let path = field + '/' + id;
    return http.delete(config.get('gateway.configuration') + urlBase + path);
};

export const searchConfigItem = (urlBase, urlApi, field, inputValue, page, size) => {
    let searchBy = '?';
    if(inputValue) {
        searchBy += `${field}=${inputValue}&`;
    }
    // let sortPath = `;${field}=ASC`;
    let sortPath = '';
    let path = `/${urlApi}${sortPath}${searchBy}page=${page}&size=${size}`;
    return http.get(config.get('gateway.configuration') + config.get('gateway.service.configuration') + path);
};