import config from 'react-global-configuration';
import {nexusFetch} from '../../util/http-client';
import mockData from './mockData.json';

export const getSyncLog = (params, page = 0, pageSize = 100) => {
    // pagination parameters
    const paramString = `?coreTitleId=titl_cRKLr&page=${page}&size=${pageSize}`;

    const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/externalsystems/search`;

    return nexusFetch(`${url}${paramString}`).then(response => {
        // TODO mock data over-ride to be removed
        response = mockData;

        // re-map data for ag-grid
        const data = (response.data || []).map(syncLog => {
            const syncLogPublishErrors = syncLog.publishErrors && Array.isArray(syncLog.publishErrors)
                ? syncLog.publishErrors : [];

            return {
                ...syncLog,
                status: syncLogPublishErrors.length > 0 ? 'Error' : 'Success',
                publishErrors: syncLogPublishErrors.join('; '),
            };
        });

        return {...response, data};
    });
};
