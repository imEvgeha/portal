import Http from '../../../../util/Http';
import config from 'react-global-configuration';

const http = Http.create();

export const exportService = {
    exportAvails: (availIDs, columns) => {
        http.defaults.timeout = config.get('avails.export.http.timeout');
        return http.post(config.get('gateway.url') + config.get('gateway.service.avails') +'/avails/download', {columnNames: columns, availIds: availIDs}, {responseType: 'arraybuffer'});
    },

    bulkExportAvails: (searchCriteria) => {
        const params = {};
        for (let key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                params[key] = searchCriteria[key];
            }
        }
        http.defaults.timeout = config.get('avails.export.http.timeout');
        return http.get(config.get('gateway.url') + config.get('gateway.service.avails') +'/avails/bulkExport', {responseType: 'arraybuffer', params: {...params, page: 0, size: 1}});
    }
};