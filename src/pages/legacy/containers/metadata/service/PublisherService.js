import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {encodedSerialize} from '@vubiquity-nexus/portal-utils/lib/Common';
import {getSyncQueryParams} from './TitleService';
import {getConfig} from '../../../../../config';

export const publisherService = {
    getExternalIds: id => {
        const url = getConfig('gateway.publisher') + getConfig('gateway.service.publisher') + `/getPublishInfo/${id}`;
        return nexusFetch(url);
    },

    registerTitle: (titleId, syncToVZ, syncToMovida) => {
        const externalSystems = getSyncQueryParams(syncToVZ, syncToMovida);
        const params = {externalSystems, titleId};
        const url = getConfig('gateway.publisher') + getConfig('gateway.service.publisher') + `/registerTitle`;

        return nexusFetch(url, {
            method: 'post',
            params: encodedSerialize(params),
        });
    },

    syncTitle: (titleId, syncToVZ, syncToMovida) => {
        const externalSystem = getSyncQueryParams(syncToVZ, syncToMovida);
        const params = {externalSystem, titleId};
        const url = getConfig('gateway.publisher') + getConfig('gateway.service.publisher') + `/syncTitle`;

        return nexusFetch(url, {
            method: 'post',
            params: encodedSerialize(params),
        });
    },
};
