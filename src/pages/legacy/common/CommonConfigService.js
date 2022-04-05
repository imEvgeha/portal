import {nexusFetch} from '../../../../packages/utils/src/http-client/index';
import {getConfig} from '../../../config';

export const getConfigApiValues = (configUrl, page = 0, size = 100, sortBy, field, searchValue) => {
    const sortPath = sortBy ? ';' + sortBy + '=ASC' : '';
    const searchBy = searchValue ? `${field}=${searchValue}&` : '';

    const path = `${configUrl}${sortPath}?${searchBy}page=${page}&size=${size}`;
    const url = getConfig('gateway.configuration') + getConfig('gateway.service.configuration') + '/' + path;
    return nexusFetch(url, {isWithErrorHandling: false});
};
