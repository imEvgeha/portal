/* eslint-disable no-useless-constructor */
import HttpService from '../../../util/http/HttpService';

export default class TitleEditorialService extends HttpService {
    static instance = null;

    editorialsByTitleId = [];
    createdEditorial = {};
    updatedEditorial = {};

    /**
     * Initialize new TitleService, if not exist
     * @returns {null} Instance of Singleton Class
     */
    static getInstance() {
        if (TitleEditorialService.instance == null) {
            TitleEditorialService.instance = new TitleEditorialService();
        }
        return this.instance;
    }

    constructor() {
        super();
    }

    /** CRUD APIs * */
    async getByTitleId(payload) {
        const {id, tenantCode} = payload;
        await this.callApi('v1', '/editorialmetadata', {
            pathParams: `titleId=${id}&includeDeleted=false`,
            params: tenantCode ? {tenantCode} : {},
        }).then(response => {
            this.setEditorialsByTitleId(response);
        });
    }

    create = async payload => {
        const body = Object.assign({}, payload?.body.editorialMetadata);

        // change the body to the new create API requirements
        body['synopsis']['shortSynopsis'] = body['synopsis']['shortDescription'];
        body['synopsis']['mediumSynopsis'] = body['synopsis']['description'];
        body['synopsis']['longSynopsis'] = body['synopsis']['longDescription'];
        body['categories'] = body['category'];
        delete body['synopsis']['longDescription'];
        delete body['synopsis']['description'];
        delete body['synopsis']['shortDescription'];
        delete body['category'];

        body['castCrew'] = body.castCrew.map(({creditsOrder: order, ...rest}) => ({
            order,
            ...rest,
        }));

        delete body.parentId;

        await this.callApi('v2', `/${body.parentId}/editorials`, {
            method: 'post',
            body,
        }).then(response => {
            this.setCreatedEditorial(response);
        });
    };

    update = async (payload, tenantCode) => {
        const params = tenantCode ? {tenantCode} : {};

        await this.callApi('v2', `/editorialmetadata`, {
            method: 'put',
            body: payload,
            params,
        }).then(response => {
            this.setUpdatedEditorial(response);
        });
    };

    setEditorialsByTitleId(editorialsByTitleId) {
        this.editorialsByTitleId = editorialsByTitleId;
    }

    setUpdatedEditorial(updatedEditorial) {
        this.updatedEditorial = updatedEditorial;
    }

    setCreatedEditorial(createdEditorial) {
        this.createdEditorial = createdEditorial;
    }
}
