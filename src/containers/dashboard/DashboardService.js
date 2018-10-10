import Http from "../../util/Http";

const http = Http.create({baseURL: 'http://localhost:8081/avails-api/v1'});

export const dashboardService = {
    ingestedAvailsCount: () => http.get('/avails', {params: {start: 0, size: 1}}),
    getAvails: (page, pageSize, sortedParams) => http.get('/avails', {params: {start: page, size: pageSize}}),

};