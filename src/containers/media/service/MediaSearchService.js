import Http from '../../../util/Http';
import config from 'react-global-configuration';


const http = Http.create();
export const mediaSearchService = {
    getFilters: () => {
        return http.get(config.get('gateway.assetManagementURL') + config.get('gateway.service.assetManagement') + '/asset/search/filter');
    },

    getAssets: (filter) => {
        return http.post(config.get('gateway.assetManagementURL') + config.get('gateway.service.assetManagement') + '/asset/search', filter);
    }
};