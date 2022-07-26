/* eslint-disable no-useless-constructor */
import HttpService from '../../../util/http/HttpService';

export default class TitleTerittorialService extends HttpService {
    static instance = null;

    territorialsByTitleId = [];
    createdTerritorial = {};
    updatedTerritorial = {};

    /**
     * Initialize new TitleService, if not exist
     * @returns {null} Instance of Singleton Class
     */
    static getInstance() {
        if (TitleTerittorialService.instance == null) {
            TitleTerittorialService.instance = new TitleTerittorialService();
        }
        return this.instance;
    }

    constructor() {
        super();
    }

    /** CRUD APIs * */
    getByTitleId = async id => {
        const response = await this.callApi('v2', `/${id}/territories`);
        this.setTerritorialsByTitleId(response);
        return response;
    };

    create = async payload => {
        // delete payload.parentId;
        delete payload.territoryType;

        await this.callApi('v2', ``, {
            method: 'post',
            pathParams: `${payload.parentId}`,
            body: payload,
        }).then(response => {
            this.setCreatedTerritorial(response);
        });
    };

    update = async (payload, tenantCode) => {
        const params = tenantCode ? {tenantCode} : {};

        await this.callApi('v2', `/territorymetadata`, {
            method: 'put',
            body: payload,
            params,
        }).then(response => {
            this.setUpdatedEditorial(response);
        });
    };

    setTerritorialsByTitleId(editorialsByTitleId) {
        this.territorialsByTitleId = editorialsByTitleId;
    }

    setUpdatedEditorial(updatedEditorial) {
        this.updatedTerritorial = updatedEditorial;
    }

    setCreatedTerritorial(createdEditorial) {
        this.createdTerritorial = createdEditorial;
    }
}
