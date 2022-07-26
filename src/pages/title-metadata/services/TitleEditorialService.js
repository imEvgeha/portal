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
    getEditorialsByTitleId = async payload => {
        const {id, selectedTenant} = payload;
        const response = await this.callApi('v1', '/editorialmetadata', {
            params: {
                titleId: `${id}`,
                includeDeleted: false,
                tenantCode: selectedTenant ? selectedTenant.id : '',
            },
        });
        this.setEditorialsByTitleId(response);
        return response;
    };

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

    /** ***************** Other APIS *************** */
    uploadMetadata = async ({file, externalId, params = {}}) => {
        const formData = new FormData();
        formData.append('file', file);
        if (externalId) {
            params.externalId = externalId;
        }
        // do not remove options cuz we need it for request
        const queryParams = new URLSearchParams({...params}).toString();

        const response = await this.callApi('v1', '/editorialmetadata/upload', {
            method: 'post',
            body: formData,
            file,
            pathParams: queryParams,
        });

        return response;
    };

    /** ***************** Utils *************** */
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
