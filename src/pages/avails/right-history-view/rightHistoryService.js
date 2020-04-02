import config from 'react-global-configuration';
import Http from '../../../util/Http';

const http = Http.create();

export const getRightsHistory = (searchIds) => {
    const body = {
        excludes: ['header'],
        searchIdType:'CORRELATION_ID',
        searchIds,
    };
    
    return http.post(`${config.get('gateway.eventApiUrl')}${config.get('gateway.service.eventApi')}/history/bulkRequest`, body );
};
