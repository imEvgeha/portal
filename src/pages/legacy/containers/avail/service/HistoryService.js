import config from 'react-global-configuration';
import {nexusFetch} from '../../../../../util/http-client/index';
import {prepareSortMatrixParam, encodedSerialize} from '../../../../../util/Common';

export const historyService = {
    advancedSearch: (searchCriteria, page, size, sortedParams) => {
        const params = {};
        for (const key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                params[key] = searchCriteria[key];
            }
        }

        return nexusFetch(
            config.get('gateway.url') +
                config.get('gateway.service.avails') +
                '/avails/ingest/history/search' +
                prepareSortMatrixParam(sortedParams),
            {
                params: encodedSerialize({...params, page, size}),
            }
        );
    },

    getHistory: (id, appendErrorReports) => {
        const queryParam = appendErrorReports ? '?appendErrorReports=true' : '';
        return nexusFetch(
            config.get('gateway.url') +
                config.get('gateway.service.avails') +
                `/avails/ingest/history/${id}${queryParam}`
        );
    },

    getAvailHistoryAttachment: id => {
        return nexusFetch(
            config.get('gateway.url') +
                config.get('gateway.service.avails') +
                `/avails/ingest/history/attachments/${id}`
        );
    },
};
