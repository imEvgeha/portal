import Http from "../../util/Http";

// const http = Http.create({baseURL: 'http://localhost:8081/avails-api/v1'});
const http = Http.create({baseURL: 'http://usla-amm-d001.dev.vubiquity.com:8081/avails-api/v1'});

export const dashboardService = {

    ingestedAvailsCount: () => http.get('/avails', {params: {page: 0, size: 1}}),

    getAvails: (searchCriteria, page, pageSize, sortedParams) => {
        console.log(searchCriteria);
        console.log(sortedParams);
        // let sortOptions = sortedParams ? sortedParams.
        const params = {};
        for (let key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]){
                params[key] = searchCriteria[key];
            }
        }
        return http.get('/avails' + '', {params: {...params, page: page, size: pageSize}});
    }

};