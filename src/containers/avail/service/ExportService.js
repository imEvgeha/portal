import Http from '../../../util/Http';
import config from 'react-global-configuration';

const http = Http.create();

export const exportService = {
    exportAvails: (rightsIDs, columns) => {
        http.defaults.timeout = config.get('avails.export.http.timeout');
        return http.post(config.get('gateway.url') + config.get('gateway.service.avails') +'/avails/export', {columnNames: columns, rightIds: rightsIDs}, {responseType: 'arraybuffer'});
    },

    bulkExportAvails: (searchCriteria, columns) => {
        const params = {};
        for (let key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                params[key] = searchCriteria[key];
            }
        }
        http.defaults.timeout = config.get('avails.export.http.timeout');
        return http.post(config.get('gateway.url') + config.get('gateway.service.avails') +'/avails/export/bulk', {columnNames: columns}, {responseType: 'arraybuffer', params: {...params, page: 0, size: 1}});
    }
};