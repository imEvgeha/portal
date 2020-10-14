import config from 'react-global-configuration';
import {nexusFetch} from '../../../../../util/http-client/index';

export const mediaSearchService = {
    getFilters: () => {
        const url =
            config.get('gateway.assetManagementURL') +
            config.get('gateway.service.assetManagement') +
            '/asset/search/filter';
        return nexusFetch(url);
    },

    getAssets: data => {
        const url =
            config.get('gateway.assetManagementURL') + config.get('gateway.service.assetManagement') + '/asset/search';
        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(data),
        });
    },
};
