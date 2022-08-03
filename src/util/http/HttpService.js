import {getApiURI, getConfig} from '@vubiquity-nexus/portal-utils/lib/config';
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

    callApi = async (apiVersion = 'v1', apiSignature = '', options = {}) => {
        this.setLoading(true);

        let {pathParams} = options;
        pathParams = pathParams ? `/${pathParams}` : '';
        delete options.pathParams;

        const tempOptions = this.constructParams(options);

        const signatureWithPathParams = `${apiSignature}${pathParams}`;
        const url = this.constructEndpoint(signatureWithPathParams, apiVersion);
        return nexusFetch(url, tempOptions);
    };

    // constructHeaders() {}

    constructBaseUrl(apiVersion) {
        let baseUrl = getConfig('gateway.kongUrl');
        const serviceReference = this.constructor.name;

        // construct base url for the needed service
        switch (serviceReference) {
            case 'TitleService':
            case 'TitleTerittorialService':
                baseUrl = getApiURI('title', '/titles', apiVersion === 'v1' ? 1 : 2);
                break;
            case 'TitleEditorialService':
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
        return `${this.constructBaseUrl(apiVersion)}${apiSignature}`;
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
            method: options.method ? `${options.method}` : 'get',
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
