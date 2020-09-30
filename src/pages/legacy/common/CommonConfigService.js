import config from 'react-global-configuration';
import {nexusFetch} from '../../../util/http-client/index';

export const getConfigApiValues = (configUrl, page = 0, size = 100, sortBy, field, searchValue) => {
    const sortPath = sortBy ? ';' + sortBy + '=ASC' : '';
    const searchBy = searchValue ? `${field}=${searchValue}&` : '';

    const path = `${configUrl}${sortPath}?${searchBy}page=${page}&size=${size}`;
    const url = config.get('gateway.configuration') + config.get('gateway.service.configuration') + '/' + path;
    return nexusFetch(url, {isWithErrorHandling: false});
};
