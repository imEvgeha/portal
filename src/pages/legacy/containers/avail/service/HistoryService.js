import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {encodedSerialize, prepareSortMatrixParam} from '@vubiquity-nexus/portal-utils/lib/Common';
import {getApiURI} from '@vubiquity-nexus/portal-utils/lib/config';

export const historyService = {
    advancedSearch: (searchCriteria, page, size, sortedParams) => {
        const params = {};
        for (const key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                params[key] = searchCriteria[key];
            }
        }

        return nexusFetch(
            getApiURI('avails') + '/avails/ingest/history/search' + prepareSortMatrixParam(sortedParams),
            {
                params: encodedSerialize({...params, page, size}),
            }
        );
    },

    getHistory: (id, appendErrorReports) => {
        const queryParam = appendErrorReports ? '?appendErrorReports=true' : '';
        return nexusFetch(getApiURI('avails') + `/avails/ingest/history/${id}${queryParam}`);
    },

    getAvailHistoryAttachment: id => {
        return nexusFetch(getApiURI('avails') + `/avails/ingest/history/attachments/${id}`);
    },
};
