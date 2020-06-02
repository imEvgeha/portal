// import {nexusFetch} from '../../../util/http-client/index';
import {camelCase, get} from 'lodash';
import data from './servicingOrdersMockData.json';
import servicingOrder from './servicingOrderMockData.json';
import serviceRequest from './serviceRequestMock.json';

// TODO: Use an actual API when ready
export const getServicingOrders = (searchCriteria = {}, page, size, sortedParams) => {
    // console.log('servicingOrdersService.getServicingOrders ', searchCriteria, page, size, sortedParams);
    return new Promise((resolve, reject) => resolve(data));
};

export const getServicingOrderById = (id) => {
    return new Promise((resolve, reject) => resolve(servicingOrder));
};

export const getServiceRequest = () => {
    return new Promise((resolve) => {
        const contracts = get(serviceRequest, ['ServiceRequest', 'Contracts', 'Contract'], []);

        // Remove nesting from the response and convert keys to camelCase
        const prettyContracts = contracts.map(contract => {
            const order = get(contract, ['Titles', 'Title', 'LineItems', 'LineItem', 'Orders', 'Order'], []);
            const title = get(contract, ['Titles', 'Title', '_Description'], '');

            const prettyOrder = {};
            Object.keys(order).forEach(key => {
               prettyOrder[camelCase(key)] = order[key];
            });

            return {title, ...prettyOrder};
        });

        resolve(prettyContracts);
    });
};

export const saveFulfillmentOrder = ({data}) => {
    // TODO - integrate with backend when we have PUT API Endpoint
    // console.log('Service.saveFulfillmentOrder data: ', data);
    return new Promise((resolve, reject) => resolve());
};

export const servicingOrdersService = {
    getServicingOrders,
    getServicingOrderById,
    saveFulfillmentOrder
};
