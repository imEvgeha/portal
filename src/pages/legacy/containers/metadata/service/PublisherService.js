import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {encodedSerialize} from '@vubiquity-nexus/portal-utils/lib/Common';
import {getSyncQueryParams} from './TitleService';
import {getApiURI} from '@vubiquity-nexus/portal-utils/lib/config';

export const publisherService = {
    getExternalIds: id => {
        const uri = `/getPublishInfo/${id}`;
        const url = getApiURI('movida', uri);
        return nexusFetch(url);
    },

    registerTitle: (titleId, syncToVZ, syncToMovida) => {
        const externalSystems = getSyncQueryParams(syncToVZ, syncToMovida);
        const params = {externalSystems, titleId};
        const uri = `/registerTitle`;
        const url = getApiURI('movida', uri);

        return nexusFetch(url, {
            method: 'post',
            params: encodedSerialize(params),
        });
    },

    syncTitle: (titleId, syncToVZ, syncToMovida) => {
        const externalSystem = getSyncQueryParams(syncToVZ, syncToMovida);
        const params = {externalSystem, titleId};
        const uri = `/syncTitle`;
        const url = getApiURI('movida', uri);

        return nexusFetch(url, {
            method: 'post',
            params: encodedSerialize(params),
        });
    },
};
