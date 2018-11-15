import Http from '../../util/Http';
import config from 'react-global-configuration';


const http = Http.create();

const prepareSortMatrixParam = function (sortedParams) {
    let matrix = '';
    sortedParams.forEach((entry) => {
        matrix += ';' + entry.id + '=' + (entry.desc ? 'DESC' : 'ASC');
    });
    return matrix;
};

export const dashboardService = {

    freeTextSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = {};
        if (searchCriteria.text) {
            params.text = searchCriteria.text;
        }
        return http.get(config.get('gateway.url') + config.get('gateway.service.avails') +'/avails/search' + prepareSortMatrixParam(sortedParams), {params: {...params, page: page, size: pageSize}});
    },

    advancedSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = {};
        for (let key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                params[key] = searchCriteria[key];
            }
        }
        return http.get(config.get('gateway.url') + config.get('gateway.service.avails') +'/avails' + prepareSortMatrixParam(sortedParams), {params: {...params, page: page, size: pageSize}});
    },

    createAvail: (avail) => {
        return http.post(config.get('gateway.url') + config.get('gateway.service.avails') +'/avails', avail);
    },

    updateAvails: (avail) => {
        return http.put(config.get('gateway.url') + config.get('gateway.service.avails') +`/avails/${avail.id}`, avail);
    },
};