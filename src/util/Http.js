import axios from 'axios';
import {keycloak, store} from '../index';
import {errorModal} from '../components/modal/ErrorModal';
import {addToast, removeToast} from '../ui-elements/nexus-toast-notification/actions';
import {
    SUCCESS_ICON, SUCCESS_TITLE, ERROR_ICON, ERROR_TITLE
} from '../ui-elements/nexus-toast-notification/constants';

/*passing errorToasts in param:
errorToast for all status codes:
errorToast: {title: '', description: ''}

can pass errorToast for specific error code as follows:
errorCodesToast: [{status: 404, title: '', description: ''}, {status: 500, title: '', description: ''}]
default error title, icon and autoDismiss are already added

can pass successToast if needed to show toast on success of a API call
default success title, icon and autoDismiss are already added (if successToast is passed then only these are displayed)*/

const ACCESS_DENIED = {
    codes: [401, 403, 451, 511],
    title: 'Access denied'
};
const ERROR_MODAL = {
    codes: [503],
    title: 'Unexpected error occurred. Please try again later'
};

const Http = {
    create: param => {
        const defaults = {
            timeout: 60000,
            headers: {'Content-Type': 'application/json'}
        };
        param = {
            defaultErrorHandling: true,
            errorToast: null,
            successToast: null,
            errorCodesToast: [],
            ...param
        };
        const http = axios.create({
            ...defaults,
            ...param
        });
        const {defaultErrorHandling, successToast, errorCodesToast, errorToast} = param;
        const defaultErrorToast = {
            title: ERROR_TITLE,
            icon: ERROR_ICON,
            isAutoDismiss: true,
        };

        http.interceptors.request.use(
            function (config) {
                const token = JSON.parse(localStorage.getItem('token'));
                if (token) config.headers.Authorization = `Bearer ${token}`;
                return config;
            },
            function (error) {
                return Promise.reject(error);
            }
        );
        http.interceptors.response.use(
            response => {
                if(successToast){
                    const actions = successToast.actions ? (
                        successToast.actions.map(action => ({
                            ...action,
                            onClick: action.onClick ? () => action.onClick(response) : () => {}
                        }))) : [];
                    store.dispatch(addToast({
                        title: SUCCESS_TITLE,
                        icon: SUCCESS_ICON,
                        isAutoDismiss: true,
                        ...successToast,
                        actions,
                    }));
                }
                return response;
            },
            error => {
                if (error.response) {
                    const {response: {status, data = {}, config: {url = '', method = ''} = {}} } = error;
                    let description;
                    if(ACCESS_DENIED.codes.includes(status)){
                        description = `Status: ${status},\nURI: ${url},\nMethod: ${method}.toUpperCase()`;
                        errorModal.open(ACCESS_DENIED.title, () => {}, {description});
                    } else{
                        if(defaultErrorHandling){
                            let toast;
                            const error = errorCodesToast.filter(error => error.status === status)[0];
                            if(error){
                                toast = {
                                    ...defaultErrorToast,
                                    ...error,
                                    description: error.description || data.message,
                                };
                            } else {
                                toast = errorToast ? {
                                    ...defaultErrorToast,
                                    ...errorToast,
                                } : {
                                    title: ERROR_MODAL.title,
                                    description: data.message || JSON.stringify(data),
                                    icon: ERROR_ICON,
                                    actions: ERROR_MODAL.codes.includes(status) ? [
                                        {content:'OK', onClick: () => store.dispatch(removeToast())}
                                    ] : [],
                                    isWithOverlay: ERROR_MODAL.codes.includes(status),
                                };
                            }
                            store.dispatch(addToast(toast));
                        }
                    }
                }
                return Promise.reject(error);
            }
        );
        return http;
    }
};

export default Http;
