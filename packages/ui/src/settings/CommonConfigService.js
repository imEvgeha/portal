import {getApiURI} from '@vubiquity-nexus/portal-utils/lib/config';
import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';

export const getConfigApiValues = (configUrl, page = 0, size = 100, sortBy, field, searchValue) => {
    const sortPath = sortBy ? `;${sortBy}=ASC` : '';
    const searchBy = searchValue ? `${field}=${searchValue}&` : '';

    const uri = `/${configUrl}${sortPath}?${searchBy}page=${page}&size=${size}`;
    const url = getApiURI('configuration', uri);
    return nexusFetch(url, {isWithErrorHandling: false});
};
