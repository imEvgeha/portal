import config from 'react-global-configuration';
import Http from '../../util/Http';

const http = Http.create();

export const getRightsHistory = (rightIds, showDiffs = true, includeMessageHeader = false) => {
    const body = {
        showDiffs,
        includeMessageHeader,
        rightIds
    };
    
    return http.post(`${config.post('gateway.eventApiUrl')}${config.get('gateway.service.eventApi')}/history/bulkRequest`, body );
};