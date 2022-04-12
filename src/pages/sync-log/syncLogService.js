import querystring from 'querystring';
import {downloadFile} from '@vubiquity-nexus/portal-utils/lib/Common';
import {getConfig} from "@vubiquity-nexus/portal-utils/lib/config";
import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';

const PAGESIZE = 100;

export const getSyncLog = (params, page = 0, size = PAGESIZE) => {
    const queryParams = {startDate: params.dateFrom, page, size};

    if (!params.dateFrom.length) {
        return Promise.resolve({data: []});
    }

    if (params.dateTo.length) queryParams['endDate'] = params.dateTo;

    const qs = querystring.stringify(queryParams);

    const url = `${getConfig('gateway.publisher')}${getConfig('gateway.service.publisher')}/publishInfo/search`;

    return nexusFetch(`${url}?${qs}`);
};

const fetchSyncLog = (startDate, endDate) => {
    const url = `${getConfig('gateway.publisher')}${getConfig('gateway.service.publisher')}/publishInfo/export`;
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
