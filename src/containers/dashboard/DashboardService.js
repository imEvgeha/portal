import Http from '../../util/Http';
import {BASE_PATH, GATEWAY_URL} from '../../constants/config';

const http = Http.create({baseURL: GATEWAY_URL + BASE_PATH});

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

    ingestedAvailsCount: () => http.get('/avails', {params: {page: 0, size: 1}}),

    freeTextSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = {};
        if (searchCriteria.text) {
            params.text = searchCriteria.text;
        }
        return http.get('/avails/search' + prepareSortMatrixParam(sortedParams), {params: {...params, page: page, size: pageSize}});
    },

    advancedSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = {};
        for (let key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                params[key] = searchCriteria[key];
            }
        }
        return http.get('/avails' + prepareSortMatrixParam(sortedParams), {params: {...params, page: page, size: pageSize}});
    },

    createAvail: (avail) => {
        return http.post('/avails', avail);
    },

    updateAvails: (avail) => {
        return http.put(`/avails/${avail.id}`, avail);
    },

    downloadAvails: (availIDs) => {
        return http.post('/avails/download', {columnNames: ['title', 'studio'], availIds: availIDs});
    },

};