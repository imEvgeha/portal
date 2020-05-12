// import Http from '../../../util/Http';
import data from './servicingOrdersMockData.json';

// const http = Http.create({defaultErrorHandling: false});

// TODO: Use an actual API when ready
export const getServicingOrders = (searchCriteria = {}, page, size, sortedParams) => {
    // console.log('servicingOrdersService.getServicingOrders ', searchCriteria, page, size, sortedParams);
    return new Promise((resolve, reject) => resolve(data));
};

export const servicingOrdersService = {
    getServicingOrders,
};
