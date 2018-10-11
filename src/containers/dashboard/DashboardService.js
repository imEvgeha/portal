import Http from "../../util/Http";

const http = Http.create({baseURL: 'http://localhost:8081/avails-api/v1'});
// const http = Http.create({baseURL: 'http://usla-amm-d001.dev.vubiquity.com:8082'});

export const dashboardService = {

    ingestedAvailsCount: () => http.get('/avails', {params: {start: 0, size: 1}}),

    getAvails: (page, pageSize, sortedParams) => {
        console.log(sortedParams);
        // let sortOptions = sortedParams ? sortedParams.
        return http.get('/avails' + '', {params: {start: page, size: pageSize}});
    }

};