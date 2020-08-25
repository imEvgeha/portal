import config from 'react-global-configuration';
import {nexusFetch} from '../../util/http-client';

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
