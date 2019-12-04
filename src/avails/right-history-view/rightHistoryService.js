import config from 'react-global-configuration';
import Http from '../../util/Http';

const http = Http.create();

export const getRightsHistory = (contextIds, showDiffs = true, includeMessageHeader = false) => {
    const body = {
        showDiffs,
        includeMessageHeader,
        contextIds,
    };
    
    return http.post(`${config.get('gateway.eventApiUrl')}${config.get('gateway.service.eventApi')}/history/bulkRequest`, body );
};