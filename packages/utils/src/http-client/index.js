import {keycloak} from '@portal/portal-auth';
import handleError from './handleError';
import handleResponse from './handleResponse';

const DEFAULT_TIMEOUT = 60000;

const fetchAPI = async (url, options = {}, abortAfter = DEFAULT_TIMEOUT, fetchHeaders = false) => {
    let controller = new AbortController();
    const {signal} = controller;
    const {token} = keycloak;

    const allOptions = {
        signal,
        method: 'get',
        ...options,
        headers: {
            ...(!options.file ? {'Content-type': 'application/json'} : {}),
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
            ...options.headers,
        },
    };

    // abort request
    const timeoutId = setTimeout(() => {
        if (controller && abortAfter) {
            controller.abort();
        }
    }, abortAfter);

    // fetch
    // handle http response status
    // parse response
    // handle error (status, statusText)

    try {
        const response = await fetch(url, allOptions);
        return await handleResponse(response, fetchHeaders);
    } catch (error) {
        throw handleError(error, options);
    } finally {
        controller = null;
        clearTimeout(timeoutId);
    }
};

/**
 * nexusFetch
 *
 * @param url
 * @param options={...fetchOptions, params, ...rest}
 * @param abortAfter=DEFAULT_TIMEOUT
 * @param fetchHeaders: boolean flag that controls whether response headers will be returned along with response body
 * @returns Promise (result fetch api)
 */
export const nexusFetch = (url, options = {}, abortAfter = DEFAULT_TIMEOUT, fetchHeaders) => {
    const {params, ...rest} = options;
    let clonedUrl = url;
    if (params && typeof params === 'string') {
        clonedUrl += `${url.indexOf('?') === -1 ? '?' : '&'}${params}`;
    }

    return fetchAPI(clonedUrl, rest, abortAfter, fetchHeaders);
};
