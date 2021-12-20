import config from 'react-global-configuration';
import {nexusFetch} from '../../../../../util/http-client/index';
import {parseAdvancedFilter} from './RightsService';
import {prepareSortMatrixParam, encodedSerialize} from '@vubiquity-nexus/portal-utils/lib/Common';

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

    getReleaseReport: searchCriteria => {
        const url = `${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights/report-new-release`;
        const abortAfter = config.get('avails.export.http.timeout');
        return nexusFetch(
            url,
            {
                method: 'post',
                body: JSON.stringify(searchCriteria),
            },
            abortAfter
        );
    },

    bulkExportMetadata: params => {
        const {locale, language, status} = params;
        const url = `${
            config.get('gateway.titleUrl') + config.get('gateway.service.title')
        }/editorialmetadata/download?locale=${locale}&language=${language}&byDopEmtTasks=${false}&emetStatus=${status}`;
        const abortAfter = config.get('avails.export.http.timeout');

        return nexusFetch(
            url,
            {
                method: 'get',
            },
            abortAfter
        );
    },
};
