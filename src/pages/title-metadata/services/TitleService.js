/* eslint-disable no-useless-constructor */
import HttpService from '../../../util/http/HttpService';
import TitleSystems from '../../metadata/constants/systems';

export default class TitleService extends HttpService {
    static instance = null;

    titles = [];
    titlesAll = [];
    titlesSearch = [];
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
    async getById(id, tenantCode) {
        await this.callApi('v1', '', {
            pathParams: id,
            params: tenantCode,
        }).then(response => {
            this.setTitleById(response);
        });
    }

    async create(queryParams, payload) {
        await this.callApi('v1', '', {
            method: 'post',
            body: payload,
            params: queryParams,
            isWithErrorHandling: false,
        }).then(response => {
            this.setCreatedTitle(response.data);
        });
    }

    async update(payload, syncToVZ, syncToMovida) {
        const legacySystemNames = this.getSyncQueryParams(syncToVZ, syncToMovida);
        const params = legacySystemNames ? {legacySystemNames} : {};

        await this.callApi('v1', '', {
            method: 'put',
            body: payload,
            params,
            pathParams: payload.id,
            isWithErrorHandling: false,
        }).then(response => {
            this.setUpdatedTitle(response.data);
        });
    }

    /** Other APIS */
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

    /** utils * */
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

    /** Getters & Setters * */
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
}
