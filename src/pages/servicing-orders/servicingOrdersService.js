import {camelCase, get} from 'lodash';
import config from 'react-global-configuration';
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

export const getServiceRequest = (externalId) => {
    const url = `${config.get('gateway.servicingOrdersUrl')}${config.get('gateway.service.servicingOrder')}/so/${externalId}/pr`;
    return nexusFetch(url, {
        method: 'get',
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
    getFulfilmentOrdersForServiceOrder,
    saveFulfillmentOrder
};
