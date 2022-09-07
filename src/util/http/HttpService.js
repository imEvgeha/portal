import {getApiURI, getConfig} from '@vubiquity-nexus/portal-utils/lib/config';
import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {pick} from 'lodash/object';
import HttpHeaders from './HttpHeaders';

export default class HttpService extends HttpHeaders {
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

    callApi = async (apiVersion = 'v1', apiSignature = '', options = {}, headersToAttach = [], abortAfter = 60000) => {
        this.setLoading(true);

        let {pathParams} = options;
        pathParams = pathParams ? `/${pathParams}` : '';
        delete options.pathParams;

        const tempOptions = this.constructParams(options, headersToAttach);

        const signatureWithPathParams = `${apiSignature}${pathParams}`;
        const url = this.constructEndpoint(signatureWithPathParams, apiVersion);
        return nexusFetch(url, tempOptions, abortAfter, true).then(res => {
            this.headers = res[1];
            return res[0];
        });
    };

    // constructHeaders() {}

    constructBaseUrl(apiVersion, isOldApi) {
        let baseUrl = getConfig('gateway.kongUrl');
        const serviceReference = this.constructor.name;

        // construct base url for the needed service
        switch (serviceReference) {
            case 'TitleService':
            case 'TitleTerittorialService':
            case 'TitleEditorialService':
                baseUrl = getApiURI('title', isOldApi ? '' : '/titles', apiVersion === 'v1' ? 1 : 2);
                break;
            case 'TitleConfigurationService':
                baseUrl = getApiURI('title', '', apiVersion === 'v1' ? 1 : 2);
                break;
            case 'PublishService':
                baseUrl = getApiURI('movida');
                break;
            default:
                baseUrl = '';
        }
        return baseUrl;
    }

    constructEndpoint(apiSignature, apiVersion) {
        const oldApiList = ['/seasonsPersonsToEpisodes'];
        return `${this.constructBaseUrl(apiVersion, oldApiList.includes(apiSignature))}${apiSignature}`;
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
    constructParams = (options, headersToAttach = []) => {
        const headers = pick(this.headers, headersToAttach);
        return {
            ...options,
            params: options.params ? this.encodedSerialize(options.params) : options.params,
            body: options.body ? JSON.stringify(options.body) : options.body,
            method: options.method ? `${options.method}` : 'get',
            headers,
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
