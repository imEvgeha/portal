import Http from '../../util/Http';
import config from 'react-global-configuration';


const http = Http.create();

const prepareSortMatrixParam = function (sortedParams) {
    let matrix = '';
    console.log('sortedParams');
    console.log(sortedParams);
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
        return http.get(config.get('gateway.url') + config.get('base.path') +'/avails/search' + prepareSortMatrixParam(sortedParams), {params: {...params, page: page, size: pageSize}});
    },

    advancedSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = {};
        for (let key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                params[key] = searchCriteria[key];
            }
        }
        return http.get(config.get('gateway.url') + config.get('base.path') +'/avails' + prepareSortMatrixParam(sortedParams), {params: {...params, page: page, size: pageSize}});
    },

    createAvail: (avail) => {
        return http.post(config.get('gateway.url') + config.get('base.path') +'/avails', avail);
    },

    updateAvails: (avail) => {
        return http.put(config.get('gateway.url') + config.get('base.path') +`/avails/${avail.id}`, avail);
    },

    downloadAvails: (availIDs) => {
        return http.post(config.get('gateway.url') + config.get('base.path') +'/avails/download', {columnNames: ['title', 'studio'], availIds: availIDs}, {responseType: 'arraybuffer'});
    },
};