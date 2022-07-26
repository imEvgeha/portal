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

    create = async (body, titleId) => {
        // delete payload.parentId;
        delete body.territoryType;

        await this.callApi('v2', ``, {
            method: 'post',
            pathParams: `${titleId}/territories`,
            body,
        }).then(response => {
            this.setCreatedTerritorial(response);
        });
    };

    update = async (body, titleId, tmetId) => {
        const response = await this.callApi('v2', `/${titleId}/territories/${tmetId}`, {
            method: 'put',
            body,
        }).then(response => {
            this.setUpdatedTerritorial(response);
        });
        this.setUpdatedTerritorial(response);
        return response;
    };

    setTerritorialsByTitleId(editorialsByTitleId) {
        this.territorialsByTitleId = editorialsByTitleId;
    }

    setUpdatedTerritorial(updatedTerritorial) {
        this.updatedTerritorial = updatedTerritorial;
    }

    setCreatedTerritorial(createdEditorial) {
        this.createdTerritorial = createdEditorial;
    }
}
