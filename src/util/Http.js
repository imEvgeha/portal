import axios from 'axios';
import { keycloak } from '../index';
import { errorModal } from '../components/modal/ErrorModal';


const Http = {
    create: function (param) {

        const defaults = {
            timeout: 10000,
            headers: { 'Content-Type': 'application/json' }
        };
        param = { ...param };
        const http = axios.create({
            ...defaults,
            ...param
        });

        http.interceptors.request.use(
            function (config) {
                const token = keycloak.instance.token;
                if (token) config.headers.Authorization = `Bearer ${token}`;
                return config;
            },
            function (error) {
                return Promise.reject(error);
            }
        );
        if (!param.noDefaultErrorHandling) {
            http.interceptors.response.use(
                function (response) {
                    return response;
                },
                function (error) {
                    if (error.response) {
                        if (403 === error.response.status || 401 === error.response.status) {
                            let description;
                            if (error.response.data) {
                                description = error.response.status +
                                    ', uri: ' + error.response.config.url +
                                    ', method: ' + error.response.config.method.toUpperCase();
                            }
                            errorModal.open('Access denied', () => {
                            }, { description: description });

                        } else {
                            let description;
                            if (error.response.data) {
                                description = JSON.stringify(error.response.data);
                            }
                            errorModal.open('Unexpected error occured. Please try again later.', () => {
                            }, { description: description, closable: true });
                        }
                    }
                    return Promise.reject(error);
                }
            );
        }
        return http;
    }
};

export default Http;