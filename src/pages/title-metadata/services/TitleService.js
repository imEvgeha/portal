/* eslint-disable no-useless-constructor */
import {get} from 'lodash';
import HttpService from '../../../util/http/HttpService';
import TitleSystems from '../../metadata/constants/systems';
import {CONTENT_TYPE} from '../constants';

export default class TitleService extends HttpService {
    static instance = null;

    titles = [];
    titlesAll = [];
    titlesSearch = [];
    advancedTitlesSearch = [];
    titleById = {};
    updatedTitle = {};
    createdTitle = {};
    /**
     * Initialize new TitleService, if not exist
     * @returns {null} Instance of Singleton Class
     */
    static getInstance() {
        if (TitleService.instance == null) {
            TitleService.instance = new TitleService();
        }
        return this.instance;
    }

    constructor() {
        super();
    }

    /** CRUD APIs * */
    getById = async (id, tenantCode, version = 'v2') => {
        const response = await this.callApi(
            version,
            '',
            {
                pathParams: id,
                params: tenantCode,
            },
            true
        );
        this.lastModified = response[1].get('last-modified');
        this.setTitleById(response[0]);
        return response[0];
    };

    create = async (body, params, apiVersion = 'v2') => {
        const queryParams = params || {};
        const response = await this.callApi(apiVersion, '', {
            method: 'post',
            body,
            params: queryParams,
            isWithErrorHandling: false,
        });
        this.setCreatedTitle(response);
        return response;
    };

    update = async (payload, syncToVZ, syncToMovida) => {
        const legacySystemNames = this.getSyncQueryParams(syncToVZ, syncToMovida);
        const params = legacySystemNames ? {legacySystemNames} : {};
        const errorOptions = {
            errorMessage:
                'Unable to save changes, title has recently been updated. Click below for latest version and resubmit.',
            shouldAppendMsgs: false,
            actionType: 'link',
            toastAction: {
                label: 'View Title',
                icon: 'pi pi-external-link',
                iconPos: 'right',
                className: 'p-button-link p-toast-button-link',
                onClick: () => window.open(window.location.href, '_blank'),
            },
        };

        const options = {
            method: 'put',
            body: payload,
            params,
            pathParams: payload.id,
            isWithErrorHandling: true,
            headers: {
                'If-Unmodified-Since': this.lastModified,
            },
            ...errorOptions,
        };

        const response = await this.callApi('v2', '', options);
        this.setUpdatedTitle(response);
        return response;
    };

    /** ***************** Other APIS *************** */
    getExternalIds = async id => {
        const response = await this.callApi('v2', '', {
            pathParams: id,
        });
        this.setTitleById(response);
        return response;
    };

    async search(searchCriteria, page, size, sortedParams) {
        const params = this.encodedSerialize({...searchCriteria, page, size});

        await this.callApi('v1', '/search', {
            params,
            pathParams: this.prepareSortMatrixParamTitles(sortedParams),
            isWithErrorHandling: false,
        }).then(response => {
            this.setSearchedTitles(response.data);
        });
    }

    getEpisodesCount = async (id, selectedTenant) => {
        const options = {
            params: {
                parentId: id,
                contentType: `EPISODE`,
                tenantCode: selectedTenant.id,
            },
        };

        await this.callApi('v1', '/search', options).then(response => {
            this.setAllTitles(response.data);
        });
    };

    advancedSearchTitles = async (searchCriteria, page, size, sortedParams, body, selectedTenant) => {
        const queryParams = {};
        const filterIsActive =
            !!Object.keys(searchCriteria).length &&
            !(Object.keys(searchCriteria).length === 1 && get(searchCriteria, 'tenantCode'));
        const partialContentTypeSearch = searchCriteria.contentType
            ? CONTENT_TYPE.find(el => el.toLowerCase().includes(searchCriteria.contentType.toLowerCase()))
            : 'init';

        // api only supports searching by single contentType value, and it has to be exact match otherwise it throws error
        if (!partialContentTypeSearch) {
            delete searchCriteria.contentType;
        }

        for (const key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                if (key === 'contentType') {
                    queryParams[key] = partialContentTypeSearch;
                } else if (key === 'title') {
                    const title = searchCriteria[key];
                    if (title.startsWith('"') && title.endsWith('"')) {
                        queryParams[key] = title.slice(1, title.length - 1);
                        queryParams['exactMatch'] = true;
                    } else {
                        queryParams[key] = title;
                    }
                } else {
                    queryParams[key] = searchCriteria[key];
                }
            }
        }

        const response = await this.callApi('v1', `${filterIsActive ? '/search' : ''}`, {
            pathParams: sortedParams ? this.prepareSortMatrixParamTitles(sortedParams) : '',
            params: {...queryParams, page, size, tenantCode: selectedTenant.id},
        });

        this.setAdvancedSearchTitles(response);
        return response;
    };

    propagateSeasonsPersonsToEpisodes = async body => {
        const response = await this.callApi('v1', `/seasonsPersonsToEpisodes`, {
            method: 'put',
            body,
        });

        return response;
    };

    freeTextSearch = async (searchCriteria, page, size, sortedParams, apiVersion = 'v2') => {
        const queryParams = {};
        for (const key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                queryParams[key] = key === 'contentType' ? searchCriteria[key].toUpperCase() : searchCriteria[key];
            }
        }

        const response = await this.callApi(apiVersion, ``, {
            params: {...queryParams, page, size},
            pathParams: this.prepareSortMatrixParamTitles(sortedParams),
        });

        return response;
    };

    /** ***************** Utils *************** */
    prepareSortMatrixParamTitles(sortedParams) {
        let matrix = '';

        if (sortedParams) {
            sortedParams.forEach(function (_ref2) {
                const id = _ref2.id;
                const colId = _ref2.colId;
                const sort = _ref2.sort;
                const desc = _ref2.desc;
                matrix += '?sort='.concat(id || colId, ',').concat(sort || (desc ? 'DESC' : 'ASC'));
            });
        }

        return matrix;
    }

    getSyncQueryParams = (syncToVZ, syncToMovida) => {
        if (syncToVZ || syncToMovida) {
            if (syncToVZ && syncToMovida) {
                return `${TitleSystems.VZ.toUpperCase()},${TitleSystems.MOVIDA.toUpperCase()}`;
            } else if (syncToVZ) {
                return TitleSystems.VZ.toUpperCase();
            }
            return TitleSystems.MOVIDA.toUpperCase();
        }
        return null;
    };

    /** ***************** Getters & Setters *************** */
    getTitles() {
        return this.titles;
    }

    setTitles(titles) {
        this.titles = titles;
    }

    getAllTitles() {
        return this.titlesAll;
    }

    setAllTitles(titles) {
        this.titlesAll = titles;
    }

    getCreatedTitle() {
        return this.createdTitle;
    }

    setCreatedTitle(title) {
        this.createdTitle = title;
    }

    getTitleById() {
        return this.titleById;
    }

    setTitleById(title) {
        this.titleById = title;
    }

    getUpdatedTitle() {
        return this.updatedTitle;
    }

    setUpdatedTitle(updatedTitle) {
        this.updatedTitle = updatedTitle;
    }

    getSearchedTitles() {
        return this.titlesSearch;
    }

    setSearchedTitles(searchTitles) {
        this.titlesSearch = searchTitles;
    }

    setAdvancedSearchTitles(advancedTitlesSearch) {
        this.advancedTitlesSearch = advancedTitlesSearch;
    }
}
