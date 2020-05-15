// import Http from '../../../util/Http';
import data from './servicingOrdersMockData.json';
import servicingOrder from './servicingOrderMockData.json';

// const http = Http.create({defaultErrorHandling: false});

// TODO: Use an actual API when ready
export const getServicingOrders = (params, page, pageSize, sortedParams) => {
    return new Promise((resolve, reject) => resolve(data));
};

export const getServicingOrderById = (id) => {
    return new Promise((resolve, reject) => resolve(servicingOrder));
};

export const servicingOrdersService = {
    getServicingOrders,
    getServicingOrderById,
};
