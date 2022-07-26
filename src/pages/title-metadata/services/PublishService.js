/* eslint-disable no-useless-constructor */
import HttpService from '../../../util/http/HttpService';

export default class PublishService extends HttpService {
    static instance = null;

    externalIds = [];
    syncedTitle = {};

    /**
     * Initialize new TitleService, if not exist
     * @returns {null} Instance of Singleton Class
     */
    static getInstance() {
        if (PublishService.instance == null) {
            PublishService.instance = new PublishService();
        }
        return this.instance;
    }

    constructor() {
        super();
    }

    /** CRUD APIs * */
    getExternalIdsById = async id => {
        const response = await this.callApi('v1', '/getPublishInfo', {
            pathParams: id,
        });
        this.setExternalIds(response);
        return response;
    };

    /** Extra APIS */
    syncTitle = async payload => {
        const {id: titleId, externalSystem} = payload;
        const params = {externalSystem, titleId};

        const response = await this.callApi('v1', '/syncTitle', {
            method: 'post',
            params,
        });

        this.setSyncTitle(response);
        return response;
    };

    registerTitle = async payload => {
        const {id: titleId, externalSystem} = payload;
        const params = {externalSystem, titleId};

        const response = await this.callApi('v1', '/registerTitle', {
            method: 'post',
            params,
        });

        this.setSyncTitle(response);
        return response;
    };

    /** Getters & Setters * */
    getExternalIds() {
        return this.externalIds;
    }

    setExternalIds(externalIds) {
        this.externalIds = externalIds;
    }

    getSyncedTitle() {
        return this.syncedTitle;
    }

    setSyncTitle(syncedTitle) {
        this.syncedTitle = syncedTitle;
    }
}
