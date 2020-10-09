import querystring from 'querystring';
import config from 'react-global-configuration';
import {downloadFile} from '../../util/Common';
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

    const url = `${config.get('gateway.publisher')}${config.get('gateway.service.publisher')}/publishInfo/search`;

    return nexusFetch(`${url}?${qs}`);
};

const fetchSyncLog = (startDate, endDate) => {
    const url = `${config.get('gateway.publisher')}${config.get('gateway.service.publisher')}/publishInfo/export`;
    const qs = querystring.stringify({
        startDate,
        endDate,
    });
    return nexusFetch(`${url}?${qs}`);
};

export const exportSyncLog = (startDate, endDate) => {
    fetchSyncLog(startDate, endDate).then(response => {
        downloadFile(response, `Sync-log-${startDate}-${endDate}`, '.csv', false);
    });
};
