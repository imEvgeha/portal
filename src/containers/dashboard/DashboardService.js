import Http from '../../util/Http';

// const http = Http.create({baseURL: 'http://localhost:8081/avails-api/v1'});
const http = Http.create({baseURL: 'http://usla-amm-d001.dev.vubiquity.com:8082/avails-api/v1'});

const prepareSortMatrixParam = function (sortedParams) {
    let matrix = '';
    console.log('sortedParams ');
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

    uploadAvail: (file) => {
        const formData = new FormData();
        formData.append('avail', file);
        return http.post('/avails', formData,  {headers: {'Content-Type': 'multipart/form-data'}});
    },

};