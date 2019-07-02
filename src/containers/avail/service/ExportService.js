import Http from '../../../util/Http';
import config from 'react-global-configuration';
import {parseAdvancedFilter} from './RightsService';
import {prepareSortMatrixParam} from '../../../util/Common';

const http = Http.create();

const languagehack  = (cols) => {
    const columns = [...cols];

    const index1 = columns.indexOf('languageAudioTypes.language');
    const index2 = columns.indexOf('languageAudioTypes.audioType');

    const indexMin = Math.min(index1, index2);
    const indexMax = Math.max(index1, index2);

    if(indexMax > -1){
        //if at least one found
        if(indexMin > -1){
            //if both found
            columns.splice(indexMin, 1, 'languageAudioTypes'); //replace first
            columns.splice(indexMax, 1); //and delete second
        }else{
            //if only one found
            columns.splice(indexMax, 1, 'languageAudioTypes'); //replace it
        }
    }

    return columns;
};

export const exportService = {
    exportAvails: (rightsIDs, columns) => {
        http.defaults.timeout = config.get('avails.export.http.timeout');
        return http.post(config.get('gateway.url') + config.get('gateway.service.avails') + '/avails/export', {columnNames: languagehack(columns), rightIds: rightsIDs}, {responseType: 'arraybuffer'});
    },

    bulkExportAvails: (searchCriteria, columns, sortedParams) => {
        const params = parseAdvancedFilter(searchCriteria);
        http.defaults.timeout = config.get('avails.export.http.timeout');
        return http.post(config.get('gateway.url') + config.get('gateway.service.avails') + '/avails/export/bulk' + prepareSortMatrixParam(sortedParams), {columnNames: languagehack(columns)}, {responseType: 'arraybuffer', params: {...params, page: 0, size: 1}});
    }
};