/* eslint-disable no-useless-constructor */
import HttpService from '../../../util/http/HttpService';

export default class TitleConfigurationService extends HttpService {
    static instance = null;

    enums = [];

    /**
     * Initialize new TitleService, if not exist
     * @returns {null} Instance of Singleton Class
     */
    static getInstance() {
        if (TitleConfigurationService.instance == null) {
            TitleConfigurationService.instance = new TitleConfigurationService();
        }
        return this.instance;
    }

    constructor() {
        super();
        this.serviceReference = 'TitleConfigurationService';
    }

    /** CRUD APIs * */

    /** Extra APIS */
    getEnums = async enumItem => {
        const params = {item: enumItem};

        const response = await this.callApi('v1', '/configuration/titles/enums', {
            params,
        });

        this.setEnums(response);
        return response;
    };

    /** Getters & Setters * */
    setEnums(enums) {
        this.enums = enums;
    }
}
