import axios from 'axios';
import {keycloak} from '../index'
import {confirmModal} from "../components/share/ConfirmModal";
import {errorModal} from "../components/share/ErrorModal";


const Http = {
    create: function (param) {
        const defaults = {
            timeout: 10000,
            headers: {'Content-Type': 'application/json'}
        };

        const http = axios.create({
            ...defaults,
            ...param
        });

        http.interceptors.request.use(
            function (config) {
                const token = keycloak.token;
                if (token) config.headers.Authorization = `Bearer ${token}`;
                return config;
            },
            function (error) {
                return Promise.reject(error);
            }
        );

        http.interceptors.response.use(
            function (response) {
                return response;
            },
            function (error) {
                if (error.response) {
                    console.log('STATUS: ' + error.response.status);
                    if (403 === error.response.status || 401 === error.response.status) {
                        let description;
                        if (error.response.data) {
                            description = error.response.status +
                              ', uri: ' + error.response.config.url +
                              ', method: ' + error.response.config.method.toUpperCase();
                        }
                        errorModal.open("Access denied", () => {
                        }, {description: description});

                    } else if (500 === error.response.status) {
                        let description;
                        if (error.response.data) {
                            description = JSON.stringify(error.response.data);
                        }
                        errorModal.open("Server error", () => {
                        }, {description: description});

                    }
                }
                return Promise.reject(error);
            }
        );

        return http;
    }
};

export default Http;