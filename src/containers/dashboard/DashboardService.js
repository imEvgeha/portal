import Http from "../../util/Http";

const http = Http.create({baseURL: 'http://localhost:9090/vehicle/api/v2'});

export const dashboardService = {
    list: () => http.get('/cars'),
}