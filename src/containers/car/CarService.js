import Http from "../../util/Http";

const http = Http.create({baseURL: 'http://localhost:9090/vehicle/api/v2'});

export const carService = {
    list: () => http.get('/cars'),
    deleteCar: (id) => http.delete('/cars/' + id),
    create: (car) => http.post('/cars', car),
    save: (user) => http.post('/users', user)
}