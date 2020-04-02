import config from 'react-global-configuration';
import Http from '../../../../../util/Http';

const http = Http.create();
export const mediaSearchService = {
    getFilters: () => {
        return http.get(config.get('gateway.assetManagementURL') + config.get('gateway.service.assetManagement') + '/asset/search/filter');
    },

    getAssets: (filter) => {
        return http.post(config.get('gateway.assetManagementURL') + config.get('gateway.service.assetManagement') + '/asset/search', filter);
    }
};
