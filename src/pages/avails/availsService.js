import config from 'react-global-configuration';
import {nexusFetch} from '../../util/http-client';
import {rightsService} from '../legacy/containers/avail/service/RightsService';

export const getRightsHistory = searchIds => {
    const url = `${config.get('gateway.eventApiUrl')}${config.get('gateway.service.eventApi')}/history/bulkRequest`;
    const body = {
        excludes: ['header'],
        searchIdType: 'CORRELATION_ID',
        searchIds,
    };

    return nexusFetch(url, {
        method: 'post',
        body: JSON.stringify(body),
    });
};

export const getLinkedToOriginalRights = (params, pageSize) => {
    return rightsService.advancedSearchV2({}, 0, pageSize, {}, params);
};
