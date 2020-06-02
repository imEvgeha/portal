import {nexusFetch} from '../../util/http-client/index';
import config from 'react-global-configuration';
import data from './servicingOrdersMockData.json';
import servicingOrder from './servicingOrderMockData.json';

// TODO: Use an actual API when ready
export const getServicingOrders = (searchCriteria = {}, page, size, sortedParams) => {
    // console.log('servicingOrdersService.getServicingOrders ', searchCriteria, page, size, sortedParams);
    return new Promise((resolve, reject) => resolve(data));
};

export const getServicingOrderById = (id) => {
    return new Promise((resolve, reject) => resolve(servicingOrder));
};

export const getServiceRequest = (externalId) => {
    const url = `${config.get('gateway.servicingOrdersUrl')}${config.get('gateway.service.servicingOrder')}/so/${externalId}/pr`;
    return nexusFetch(url, {
        method: 'get',
    });
};

export const servicingOrdersService = {
    getServicingOrders,
    getServicingOrderById,
};
