import config from 'react-global-configuration';
import {nexusFetch} from '../../../../../util/http-client/index';
import {parseAdvancedFilter} from './RightsService';
import {prepareSortMatrixParam, encodedSerialize} from '../../../../../util/Common';

export const exportService = {
    exportAvails: (rightsIDs, columns) => {
        const abortAfter = config.get('avails.export.http.timeout');
        const url = config.get('gateway.url') + config.get('gateway.service.avails') + '/avails/export';
        const data = {columnNames: columns, rightIds: rightsIDs};

        return nexusFetch(
            url,
            {
                method: 'post',
                body: JSON.stringify(data),
            },
            abortAfter
        );
    },

    bulkExportAvails: (searchCriteria, columns, sortedParams) => {
        const params = parseAdvancedFilter(searchCriteria);
        const url =
            config.get('gateway.url') +
            config.get('gateway.service.avails') +
            '/avails/export/bulk' +
            prepareSortMatrixParam(sortedParams);
        const abortAfter = config.get('avails.export.http.timeout');
        const data = {columnNames: columns};

        return nexusFetch(
            url,
            {
                method: 'post',
                body: JSON.stringify(data),
                params: encodedSerialize({...params, page: 0, size: 1}),
            },
            abortAfter
        );
    },
};
