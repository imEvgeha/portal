import Http from '../../../util/Http';
import config from 'react-global-configuration';
import {prepareSortMatrixParam, encodedSerialize} from '../../../util/Common';

const http = Http.create();

export const historyService = {

    advancedSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = {};
        for (const key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                params[key] = searchCriteria[key];
            }
        }

        return http.get(config.get('gateway.url') + config.get('gateway.service.avails') +'/avails/ingest/history/search' + prepareSortMatrixParam(sortedParams), {paramsSerializer : encodedSerialize, params: {...params, page: page, size: pageSize}});
    },

    getHistory: (id, appendErrorReports) => {
        const queryParam = appendErrorReports ? '?appendErrorReports=true' : '';
        return http.get(config.get('gateway.url') + config.get('gateway.service.avails') + `/avails/ingest/history/${id}${queryParam}`);
    },

    getAvailHistoryAttachment: (id) => {
        return http.get(config.get('gateway.url') + config.get('gateway.service.avails') + `/avails/ingest/history/attachments/${id}`);
    }
};