import config from 'react-global-configuration';
import {nexusFetch} from '../../../../../util/http-client/index';
import {encodedSerialize} from '@vubiquity-nexus/portal-utils/lib/Common';
import {getSyncQueryParams} from './TitleService';

export const publisherService = {
    getExternalIds: id => {
        const url = config.get('gateway.publisher') + config.get('gateway.service.publisher') + `/getPublishInfo/${id}`;
        return nexusFetch(url);
    },

    registerTitle: (titleId, syncToVZ, syncToMovida) => {
        const externalSystems = getSyncQueryParams(syncToVZ, syncToMovida);
        const params = {externalSystems, titleId};
        const url = config.get('gateway.publisher') + config.get('gateway.service.publisher') + `/registerTitle`;

        return nexusFetch(url, {
            method: 'post',
            params: encodedSerialize(params),
        });
    },

    syncTitle: (titleId, syncToVZ, syncToMovida) => {
        const externalSystem = getSyncQueryParams(syncToVZ, syncToMovida);
        const params = {externalSystem, titleId};
        const url = config.get('gateway.publisher') + config.get('gateway.service.publisher') + `/syncTitle`;

        return nexusFetch(url, {
            method: 'post',
            params: encodedSerialize(params),
        });
    },
};
