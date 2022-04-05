import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {parseAdvancedFilter} from './RightsService';
import {encodedSerialize, prepareSortMatrixParam} from '@vubiquity-nexus/portal-utils/lib/Common';
import {keycloak} from '@vubiquity-nexus/portal-auth/keycloak';
import {getConfig} from '../../../../../config';

export const exportService = {
    exportAvails: (rightsIDs, columns) => {
        const abortAfter = getConfig('avails.export.http.timeout');
        const url = getConfig('gateway.url') + getConfig('gateway.service.avails') + '/avails/export';
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
            getConfig('gateway.url') +
            getConfig('gateway.service.avails') +
            '/avails/export/bulk' +
            prepareSortMatrixParam(sortedParams);
        const abortAfter = getConfig('avails.export.http.timeout');
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
        const url = `${getConfig('gateway.url')}${getConfig('gateway.service.avails')}/rights/report-new-release`;
        const abortAfter = getConfig('avails.export.http.timeout');
        return nexusFetch(
            url,
            {
                method: 'post',
                body: JSON.stringify(searchCriteria),
            },
            abortAfter
        );
    },

    bulkExportMetadata: async params => {
        const headers = new Headers();
        const {token} = keycloak;
        headers.append('Authorization', `Bearer ${token}`);
        headers.append('Accept', `application/vnd.ms-excel`);
        const {locale, language, status} = params;
        const statusUrl = status !== 'openDopTasks' ? `&emetStatus=${status}` : ``;
        const url = `${
            getConfig('gateway.titleUrl') + getConfig('gateway.service.title')
        }/editorialmetadata/download?locale=${locale}&language=${language}&byDopEmtTasks=${
            status === 'openDopTasks'
        }${statusUrl}`;
        const abortAfter = getConfig('avails.export.http.timeout');

        return nexusFetch(url, {
            method: 'get',
            headers,
        });
    },
};
