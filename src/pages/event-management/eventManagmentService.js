import Http from '../../util/Http';
import mockData from './eventManagementMockData.json';

const http = Http.create();

export const getEventSearch = () => {
    const url = './src/pages/event-management/eventManagementMockData.json';
    return http.get(url);
};
