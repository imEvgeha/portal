/* eslint-disable no-useless-constructor */
import {HeadersEnum} from '../../../util/http/HttpHeaders';
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

    create = async (body, errorOptions = {}, apiVersion = 'v2') => {
        const headersToAttach = [HeadersEnum.IF_UNMODIFIED_SINCE];

        const response = await this.callApi(
            apiVersion,
            `/${body?.parentId}/editorials`,
            {
                method: 'post',
                body,
                ...errorOptions,
            },
            headersToAttach
        );

        this.setCreatedEditorial(response);
        return response;
    };

    update = async (payload, errorOptions) => {
        const headersToAttach = [HeadersEnum.IF_UNMODIFIED_SINCE];
        const body = payload?.body;

        const response = await this.callApi(
            'v2',
            `/${body?.titleId}/editorials/${body?.id}`,
            {
                method: 'put',
                body,
                ...errorOptions,
            },
            headersToAttach
        );
        this.setUpdatedEditorial(response);
        return response;
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

    addAutoDecorate = async (payload, apiVersion = 'v2') => {
        const {id, titleId, decorateBody} = payload;
        const response = await this.callApi(apiVersion, `/${titleId}/editorials/${id}/decorate`, {
            method: 'post',
            body: decorateBody,
        });
        this.setAutoDecorate(response);
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

    setAutoDecorate(createdAutoDecorate) {
        this.createdAutoDecorate = createdAutoDecorate;
    }
}
