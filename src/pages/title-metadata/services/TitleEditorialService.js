/* eslint-disable no-useless-constructor */
import HttpService from '../../../util/http/HttpService';

export default class TitleEditorialService extends HttpService {
    static instance = null;

    editorialsByTitleId = [];
    createdEditorial = {};
    updatedEditorial = {};
    lastModified = undefined;

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
        const {id} = payload;
        const response = await this.callApi('v2', `/${id}/editorials`, {});
        this.setEditorialsByTitleId(response);
        return response;
    };

    create = async (body, apiVersion = 'v2') => {
        await this.callApi(apiVersion, `/${body?.parentId}/editorials`, {
            method: 'post',
            body,
        }).then(response => {
            this.setCreatedEditorial(response);
        });
    };

    update = async payload => {
        const body = payload?.body;

        await this.callApi('v2', `/${body?.titleId}/editorials/${body?.id}`, {
            method: 'put',
            body,
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
