import {camelCase, get} from 'lodash';
import config from 'react-global-configuration';
import {encodedSerialize, prepareSortMatrixParam} from '../../util/Common';
import {parseAdvancedFilter} from '../legacy/containers/avail/service/RightsService';
import {nexusFetch} from '../../util/http-client';

const baseServicingOrdersURL = config => {
    return `${config.get('gateway.servicingOrdersUrl')}${config.get(
        'gateway.service.servicingOrder'
    )}`;
};

// TODO: Use an actual API when ready
export const getServicingOrders = (searchCriteria = {}, page, size, sortedParams) => {
    let queryParams = {};
    Object.keys(searchCriteria).forEach((key) => {
        let value = searchCriteria[key];
        if(value instanceof Object) {
            queryParams = {
                ...queryParams,
                ...value
            };
        } else {
            queryParams[key] = value;
        }
    });
    const url = `${baseServicingOrdersURL(config)}/search/so${prepareSortMatrixParam(
        sortedParams
    )}`;
    const params = encodedSerialize({...queryParams, page, size});
    return nexusFetch(url, {params});
};

export const getServicingOrderById = id => {
    const url = `${baseServicingOrdersURL(config)}/so/${id}`;
    return nexusFetch(url);
};

export const getFulfilmentOrdersForServiceOrder = id => {
    const url = `${baseServicingOrdersURL(config)}/so/${id}/fo`;
    return nexusFetch(url);
};

export const getServiceRequest = externalId => {
    const url = `${baseServicingOrdersURL(config)}/so/${externalId}/pr`;
    return nexusFetch(url, {
        method: 'get'
    });
};

export const saveFulfillmentOrder = ({data}) => {
    const url = `${baseServicingOrdersURL(config)}/fo`;
    return nexusFetch(url, {
        method: 'put',
        body: JSON.stringify(data)
    });
};

/**
 * Export a list of servicing orders as a CSV file. This endpoint
 * returns a data blob which can be converted to a .csv file.
 * @param servicingOrders - Array of servicing order ids
 */
export const exportServicingOrders = (servicingOrders) => {
    const url = `${baseServicingOrdersURL(config)}/so/export`;
    return nexusFetch(url, {
        method: 'post',
        body: JSON.stringify(servicingOrders)
    });
};

export const servicingOrdersService = {
    getServicingOrders,
    getServicingOrderById,
    getFulfilmentOrdersForServiceOrder,
    saveFulfillmentOrder
};
