import Http from '../../util/Http';
import config from 'react-global-configuration';

const http = Http.create();

const prepareSortMatrixParam = function (sortedParams) {
    let matrix = '';
    if(sortedParams) sortedParams.forEach((entry) => {
        matrix += ';' + entry.id + '=' + (entry.desc ? 'DESC' : 'ASC');
    });
    return matrix;
};

export const historyService = {

    advancedSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = {};
        for (let key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                params[key] = searchCriteria[key];
            }
        }

        return http.get('http://usla-amm-d001.dev.vubiquity.com:8083' + config.get('gateway.service.avails') +'/avails/ingest/history/search' + prepareSortMatrixParam(sortedParams), {params: {...params, page: page, size: pageSize}});
    },
};