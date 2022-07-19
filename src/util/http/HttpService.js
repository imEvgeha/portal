/* eslint-disable no-console,no-unused-vars */

import {getConfig} from '@vubiquity-nexus/portal-utils/lib/config';
import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';

export default class HttpService {
    loading = true;

    /**
     * Initialize new TitleService, if not exist
     * @returns {null} Instance of Singleton Class
     */
    static getInstance() {
        if (HttpService.instance == null) {
            HttpService.instance = new HttpService();
        }
        return this.instance;
    }

    callApi(apiVersion = 'v1', apiSignature = '', options = {}) {
        this.setLoading(true);

        let {pathParams} = options;
        pathParams = pathParams ? `/${pathParams}` : '';
        delete options.pathParams;

        const tempOptions = this.constructParams(options);

        const signatureWithPathParams = `${apiSignature}${pathParams}`;
        const url = this.constructEndpoint(signatureWithPathParams, apiVersion);
        return nexusFetch(url, tempOptions).then(() => this.setLoading(false));
    }

    // constructHeaders() {}

    constructBaseUrl(apiVersion) {
        let baseUrl = getConfig('gateway.kongUrl');
        const serviceReference = this.constructor.name;

        // construct base url for the needed service
        switch (serviceReference) {
            case 'TitleService':
            case 'TitleEditorialService':
            case 'TitleTerittorialService':
                baseUrl += `/titles${
                    apiVersion === 'v1' ? getConfig('gateway.service.title') : getConfig('gateway.service.titleV2')
                }/titles`;
                break;
            default:
                baseUrl = '';
        }
        return baseUrl;
    }

    constructEndpoint(apiSignature, apiVersion) {
        const fullUrl = `${this.constructBaseUrl(apiVersion)}${apiSignature}`;
        console.log(fullUrl);
        return fullUrl;
    }

    // Getters & Setters
    isLoading() {
        return this.loading;
    }

    setLoading(loadingStatus) {
        this.loading = loadingStatus;
    }

    // TODO: MOVE this to a HttpUtilsService
    /** utils * */
    constructParams = options => {
        return {
            params: options.params ? this.encodedSerialize(options.params) : options.params,
            body: options.body ? JSON.stringify(options.body) : options.body,
            method: options.method,
        };
    };

    transformQueryParams(searchCriteria) {
        const queryParams = {};
        for (const key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                queryParams[key] = key === 'contentType' ? searchCriteria[key].toUpperCase() : searchCriteria[key];
            }
        }
        return queryParams;
    }

    encodedSerialize(params) {
        return Object.entries(params)
            .map(function (x) {
                return ''.concat(encodeURIComponent(x[0]), '=').concat(encodeURIComponent(x[1]));
            })
            .join('&');
    }
}
