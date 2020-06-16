import config from 'react-global-configuration';
import {nexusFetch} from '../../../../../util/http-client/index';
import {parseAdvancedFilter} from './RightsService';
import {prepareSortMatrixParam, encodedSerialize} from '../../../../../util/Common';

const filterColumnNames = (cols) => {
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

    return columns.filter((col) => { return !col.includes('territory.') });
};

export const exportService = {
    exportAvails: (rightsIDs, columns) => {
        const abortAfter = config.get('avails.export.http.timeout');
        const url = config.get('gateway.url') + config.get('gateway.service.avails') + '/avails/export';
        const data = {columnNames: filterColumnNames(columns), rightIds: rightsIDs};

        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(data),
        }, abortAfter);
    },

    bulkExportAvails: (searchCriteria, columns, sortedParams) => {
        const params = parseAdvancedFilter(searchCriteria);
        const url = config.get('gateway.url') + config.get('gateway.service.avails') + '/avails/export/bulk' + prepareSortMatrixParam(sortedParams);
        const abortAfter = config.get('avails.export.http.timeout');
        const data = {columnNames: filterColumnNames(columns)};

        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(data),
            params: encodedSerialize({...params, page: 0, size: 1}),
        }, abortAfter);
    }
};
