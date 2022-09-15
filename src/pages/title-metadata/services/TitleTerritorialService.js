/* eslint-disable no-useless-constructor */
import {HeadersEnum} from '../../../util/http/HttpHeaders';
import HttpService from '../../../util/http/HttpService';

export default class TitleTerritorialService extends HttpService {
    static instance = null;

    territorialsByTitleId = [];
    createdTerritorial = {};
    updatedTerritorial = {};

    /**
     * Initialize new TitleService, if not exist
     * @returns {null} Instance of Singleton Class
     */
    static getInstance() {
        if (TitleTerritorialService.instance == null) {
            TitleTerritorialService.instance = new TitleTerritorialService();
        }
        return this.instance;
    }

    constructor() {
        super();
        this.serviceReference = 'TitleTerritorialService';
    }

    /** CRUD APIs * */
    getByTitleId = async id => {
        const response = await this.callApi('v2', `/${id}/territories`, {});
        this.setTerritorialsByTitleId(response);
        return response;
    };

    create = async (body, titleId, errorOptions) => {
        // delete payload.parentId;
        delete body.territoryType;
        const headersToAttach = [HeadersEnum.IF_UNMODIFIED_SINCE];

        const response = await this.callApi(
            'v2',
            ``,
            {
                method: 'post',
                pathParams: `${titleId}/territories`,
                body,
                ...errorOptions,
            },
            headersToAttach
        );

        this.setCreatedTerritorial(response);
        return response;
    };

    update = async (body, titleId, tmetId, errorOptions) => {
        const headersToAttach = [HeadersEnum.IF_UNMODIFIED_SINCE];

        const response = await this.callApi(
            'v2',
            `/${titleId}/territories/${tmetId}`,
            {
                method: 'put',
                body,
                ...errorOptions,
            },
            headersToAttach
        );
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
