/* eslint-disable no-useless-constructor */
import HttpService from '../../../util/http/HttpService';

export default class TitleTerittorialService extends HttpService {
    static instance = null;

    territorialsByTitleId = [];
    createdTerritorial = {};
    updatedTerritorial = {};
    lastModified = undefined;

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

    create = async (body, titleId) => {
        // delete payload.parentId;
        delete body.territoryType;

        await this.callApi('v2', ``, {
            method: 'post',
            pathParams: `${titleId}/territories`,
            body,
            headers: {
                'If-Unmodified-Since': this.lastModified,
            },
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
