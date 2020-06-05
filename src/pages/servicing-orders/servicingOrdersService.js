import {camelCase, get} from 'lodash';
import config from 'react-global-configuration';
import serviceRequest from './serviceRequestMock.json';
import {encodedSerialize, prepareSortMatrixParam} from '../../util/Common';
import {parseAdvancedFilter} from '../legacy/containers/avail/service/RightsService';
import {nexusFetch} from '../../util/http-client';

// TODO: Use an actual API when ready
export const getServicingOrders = (searchCriteria = {}, page, size, sortedParams) => {
    const queryParams = parseAdvancedFilter(searchCriteria);
    const url = `${config.get('gateway.servicingOrdersUrl')}${config.get('gateway.service.servicingOrder')}/search/so${prepareSortMatrixParam(sortedParams)}`;
    const params = encodedSerialize({...queryParams, page, size});
    return nexusFetch(url, {params});
};

export const getServicingOrderById = (id) => {
    // return new Promise((resolve, reject) => resolve(servicingOrder));
    // const url = `${config.get('gateway.servicingOrdersUrl')}${config.get('gateway.service.servicingOrder')}/so/${id}`;
    // return nexusFetch(url);
    const url = `${config.get('gateway.servicingOrdersUrl')}${config.get('gateway.service.servicingOrder')}/search/so`;
    const queryParams = parseAdvancedFilter({external_id:id});
    const params = encodedSerialize({...queryParams});
    return nexusFetch(url, {params}).then((response)=>{
        if(response && response.total && response.data && Array.isArray(response.data) && response.data.length){
            return response.data[0];
        }
        return response;
    });
};

export const getFulfilmentOrdersForServiceOrder = (id) => {
    const url = `${config.get('gateway.servicingOrdersUrl')}${config.get('gateway.service.servicingOrder')}/so/${id}/fo`;
    return nexusFetch(url);
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

export const servicingOrdersService = {
    getServicingOrders,
    getServicingOrderById,
    getFulfilmentOrdersForServiceOrder
};
