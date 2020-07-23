import {isObject} from 'lodash';
import {keycloak} from '../../auth/keycloak';
import handleError from './handleError';
import handleResponse from './handleResponse';

const DEFAULT_TIMEOUT = 60000;

const fetchAPI = async (url, options = {}, abortAfter = DEFAULT_TIMEOUT) => {
    let controller = new AbortController();
    const {signal} = controller;
    const {token} = keycloak;

    const allOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? {'Authorization': `Bearer ${token}`} : {}),
        },
        signal,
        method: 'get',
        ...options,
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
        const parsedResponse = await handleResponse(response);
        return parsedResponse;
    } catch (error) {
        const handledError = await handleError(error, options);
        throw handledError;
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
 * @returns Promise (result fetch api)
 */
export const nexusFetch = (url, options = {}, abortAfter = DEFAULT_TIMEOUT) => {
    const {params, ...rest} = options;
    if (params && typeof params === 'string') {
        url += `${url.indexOf('?') === -1 ? '?' : '&'}${params}`;
    }

    return fetchAPI(url, rest, abortAfter);
};

