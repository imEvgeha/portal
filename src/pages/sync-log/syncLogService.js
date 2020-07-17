import querystring from 'querystring';
import config from 'react-global-configuration';
import {nexusFetch} from '../../util/http-client';

const PAGESIZE = 100;

export const getSyncLog = (params, page = 0, size = PAGESIZE) => {
    if (!params.dateFrom.length) {
        return Promise.resolve({data: []});
    }

    const qs = querystring.stringify({
        startDate: params.dateFrom,
        endDate: params.dateTo,
        page,
        size,
    });

    const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/externalsystems/search`;

    return nexusFetch(`${url}?${qs}`);
};
