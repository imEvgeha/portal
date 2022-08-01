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
        const response = await this.callApi('v2', `/${id}/territories`, {}, true);
        this.lastModified = response[1].get('last-modified');
        this.setTerritorialsByTitleId(response[0]);
        return response[0];
    };

    create = async (body, titleId, errorOptions) => {
        // delete payload.parentId;
        delete body.territoryType;

        const response = await this.callApi('v2', ``, {
            method: 'post',
            pathParams: `${titleId}/territories`,
            body,
            headers: {
                'If-Unmodified-Since': this.lastModified,
            },
            ...errorOptions,
        });
        this.setCreatedTerritorial(response);
        return response;
    };

    update = async (body, titleId, tmetId, errorOptions) => {
        const response = await this.callApi('v2', `/${titleId}/territories/${tmetId}`, {
            method: 'put',
            body,
            headers: {
                'If-Unmodified-Since': this.lastModified,
            },
            ...errorOptions,
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
