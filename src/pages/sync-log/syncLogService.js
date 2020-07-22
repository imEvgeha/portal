import querystring from 'querystring';
import config from 'react-global-configuration';
import {nexusFetch} from '../../util/http-client';
import {downloadFile} from '../../util/Common';

export const getSyncLog = (params, page = 0, size = 100) => {
    if (!params.dateFrom.length) {
        return Promise.resolve({data: []});
    }

    const qs = querystring.stringify({
        startDate: params.dateFrom,
        endDate: params.dateTo,
        page,
        size
    });

    const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/externalsystems/search`;

    return nexusFetch(`${url}?${qs}`);
};

const fetchSyncLog = (startDate, endDate) => {
    const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/externalsystems/export`;
    const qs = querystring.stringify({
        startDate,
        endDate,
    });
    return nexusFetch(`${url}?${qs}`);
};

export const exportSyncLog = (startDate, endDate) => {
    fetchSyncLog(startDate, endDate)
        .then(response => {
            downloadFile(response, `Sync-log-${startDate}-${endDate}`, '.csv', false);
        }).catch(err => console.log(err));
};
