import {encodedSerialize, prepareSortMatrixParam} from '@vubiquity-nexus/portal-utils/lib/Common';
import config from 'react-global-configuration';
import {nexusFetch} from '../../util/http-client';

const baseServicingOrdersURL = config => {
    return `${config.get('gateway.servicingOrdersUrl')}${config.get('gateway.service.servicingOrder')}`;
};

const deteAssetURL = config => {
    return `${config.get('gateway.deteBaseUrl')}${config.get('gateway.service.deteAsset')}`;
};

const deteTitleURL = config => {
    return `${config.get('gateway.deteBaseUrl')}${config.get('gateway.service.deteTitle')}`;
};

export const getSpecOptions = (recipientId, tenant) => {
    const url = `${config.get(
        'gateway.deteBaseUrl'
    )}/outputFormats?recipientId=${recipientId}&tenant=${tenant}&sort=OUTPUTTEMPLATEID`;
    return nexusFetch(url);
};

// TODO: Use an actual API when ready
export const getServicingOrders = (searchCriteria = {}, page, size, sortedParams) => {
    const defaultSort = sortedParams.length ? sortedParams : [{colId: "submitted_date", sort: "desc"}];
    let queryParams = {};
    Object.keys(searchCriteria).forEach(key => {
        const value = searchCriteria[key];
        if (value instanceof Object) {
            queryParams = {
                ...queryParams,
                ...value,
            };
        } else {
            queryParams[key] = value;
        }
    });
    const url = `${baseServicingOrdersURL(config)}/search/so${prepareSortMatrixParam(defaultSort)}`;
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
        method: 'get',
    });
};

export const saveFulfillmentOrder = ({data}) => {
    const url = `${baseServicingOrdersURL(config)}/fo`;
    return nexusFetch(url, {
        method: 'put',
        body: JSON.stringify(data),
    });
};

/**
 * Export a list of servicing orders as a CSV file. This endpoint
 * returns a data blob which can be converted to a .csv file.
 * @param servicingOrders - Array of servicing order ids
 */
export const exportServicingOrders = servicingOrders => {
    const url = `${baseServicingOrdersURL(config)}/so/export`;
    return nexusFetch(url, {
        method: 'post',
        body: JSON.stringify(servicingOrders),
    });
};

export const getDeteTitleByBarcode = barcode => {
    const url = `${deteTitleURL(config)}/assetId/${barcode}`;
    return nexusFetch(url);
};

export const getDeteAssetByBarcode = barcode => {
    const url = `${deteAssetURL(config)}/${barcode}`;
    return nexusFetch(url);
};

export const servicingOrdersService = {
    getServicingOrders,
    getServicingOrderById,
    getFulfilmentOrdersForServiceOrder,
    saveFulfillmentOrder,
    exportServicingOrders,
};

export const getConfig = () => {
    const url = `${baseServicingOrdersURL(config)}/so/${externalId}/pr`; // Todo: get exact url from mgm
    return nexusFetch(url, {
        method: 'get',
    });
};