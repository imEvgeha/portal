import Http from '../../util/Http';
import config from 'react-global-configuration';
import {prepareSortMatrixParam} from '../../util/Common';

const http = Http.create();

export const historyService = {

    advancedSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = {};
        for (let key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                params[key] = searchCriteria[key];
            }
        }

        return http.get(config.get('gateway.url') + config.get('gateway.service.avails') +'/avails/ingest/history/search' + prepareSortMatrixParam(sortedParams), {params: {...params, page: page, size: pageSize}});
    },
};