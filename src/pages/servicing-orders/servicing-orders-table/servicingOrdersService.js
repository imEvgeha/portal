// import {nexusFetch} from '../../../util/http-client/index';
import data from './servicingOrdersMockData.json';

// TODO: Use an actual API when ready
export const getServicingOrders = (params, page, pageSize, sortedParams) => {
    return new Promise((resolve, reject) => resolve(data));
};

export const servicingOrdersService = {
    getServicingOrders,
};
