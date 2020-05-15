import Http from '../../util/Http';
import mockData from './eventManagementMockData.json';
import config from 'react-global-configuration';

const http = Http.create();

export const getEventSearch = () => {
    const url = './src/pages/event-management/eventManagementMockData.json';
    return http.get(url);
};

export const replayEvent = ({eventId}) => {
    return http.post(`${config.get('gateway.eventApiUrl')}${config.get('gateway.service.eventApi')}/admin/replay/${eventId}`);
};

