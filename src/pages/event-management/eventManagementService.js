import mockData from './eventManagementMockData.json';

export const getEventSearch = () => {
    return new Promise((resolve, reject) => resolve(mockData));
};
