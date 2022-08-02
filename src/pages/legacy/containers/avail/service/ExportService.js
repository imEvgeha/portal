import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {parseAdvancedFilter} from './RightsService';
import {encodedSerialize, prepareSortMatrixParam} from '@vubiquity-nexus/portal-utils/lib/Common';
import {keycloak} from '@portal/portal-auth';
import {getApiURI, getConfig} from '@vubiquity-nexus/portal-utils/lib/config';

export const exportService = {
    exportAvails: (rightsIDs, columns) => {
        const abortAfter = getConfig('avails.export.http.timeout');
        const uri = `/avails/export`;
        const url = getApiURI('avails', uri);

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
        const uri = '/avails/export/bulk' + prepareSortMatrixParam(sortedParams);
        const url = getApiURI('avails', uri);

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
        const uri = `/rights/report-new-release`;
        const url = getApiURI('avails', uri);

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

    bulkExportMetadata: async (params, options) => {
        const {token} = keycloak;

        let headers = {
            Authorization: `Bearer ${token}`,
            Accept: `application/vnd.ms-excel`,
        };

        const {locale, language, status} = params;
        const statusUrl = status !== 'openDopTasks' ? `&emetStatus=${status}` : ``;

        const uri = `/editorialmetadata/download?locale=${locale}&language=${language}&byDopEmtTasks=${
            status === 'openDopTasks'
        }${statusUrl}`;
        const url = getApiURI('title', uri);

        const abortAfter = getConfig('avails.export.http.timeout');

        return nexusFetch(
            url,
            {
                method: 'get',
                headers,
                ...options,
            },
            abortAfter
        );
    },
};
