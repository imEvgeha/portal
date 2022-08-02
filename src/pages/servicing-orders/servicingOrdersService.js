import {encodedSerialize, prepareSortMatrixParam} from '@vubiquity-nexus/portal-utils/lib/Common';
import {getApiURI} from '@vubiquity-nexus/portal-utils/lib/config';
import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';

const baseServicingOrdersURL = (uri = '') => {
    return getApiURI('servicingOrder', uri, 0);
};

const deteAssetURL = (uri = '') => {
    return getApiURI('dete', `/dete-asset-metadata-service/assets${uri}`, 0);
};

const deteTitleURL = (uri = '') => {
    return getApiURI('dete', `/dete-asset-metadata-service/titles${uri}`, 0);
};

export const getSpecOptions = (recipientId, tenant) => {
    const uri = `/outputFormats?recipientId=${recipientId}&tenant=${tenant}&sort=OUTPUTTEMPLATEID`;
    const url = getApiURI('dete', uri, 0);

    return nexusFetch(url);
};

// TODO: Use an actual API when ready
export const getServicingOrders = (searchCriteria = {}, page, size, sortedParams) => {
    const defaultSort = sortedParams.length ? sortedParams : [{colId: 'submitted_date', sort: 'desc'}];
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
    const uri = `/search/so${prepareSortMatrixParam(defaultSort)}`;
    const url = baseServicingOrdersURL(uri);
    const params = encodedSerialize({...queryParams, page, size});
    return nexusFetch(url, {params});
};

export const getServicingOrderById = id => {
    const uri = `/so/${id}`;
    const url = baseServicingOrdersURL(uri);
    return nexusFetch(url);
};

export const getFulfilmentOrdersForServiceOrder = id => {
    const uri = `/so/${id}/fo`;
    const url = baseServicingOrdersURL(uri);
    return nexusFetch(url);
};

export const getFilteredByTitleOrders = (id, type, status, page) => {
    const newType = type === 'TITLE_ASCENDING' ? 'ASC' : 'DESC';
    const uri = `/so/${id}/soi;product_description=${newType}/fo?soiStatus=${status}&page=${page - 1}&size=100`;
    const url = baseServicingOrdersURL(uri);

    return nexusFetch(url);
};

export const getFilteredByIdOrders = (id, type, status, page) => {
    const newType = type === 'ID_ASCENDING' ? 'ASC' : 'DESC';
    const uri = `/so/${id}/soi;external_id=${newType}/fo?soiStatus=${status}&page=${page - 1}&size=100`;
    const url = baseServicingOrdersURL(uri);

    return nexusFetch(url);
};

export const getAdvancedFulfilmentOrdersForServiceOrder = (id, page, size) => {
    const uri = `/so/${id}/soi;external_id=ASC/fo?soiStatus=All&page=${page}&size=${size}`;
    const url = baseServicingOrdersURL(uri);
    return nexusFetch(url);
};

export const getServiceRequest = externalId => {
    const uri = `/so/${externalId}/pr`;
    const url = baseServicingOrdersURL(uri);

    return nexusFetch(url, {
        method: 'get',
    });
};

export const saveFulfillmentOrder = ({data}) => {
    const uri = `/fo`;
    const url = baseServicingOrdersURL(uri);

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
    const uri = `/so/export`;
    const url = baseServicingOrdersURL(uri);

    return nexusFetch(url, {
        method: 'post',
        body: JSON.stringify(servicingOrders),
    });
};

export const getDeteTitleByBarcode = barcode => {
    const uri = `/assetId/${barcode}`;
    const url = deteTitleURL(uri);
    return nexusFetch(url);
};

export const getDeteAssetByBarcode = barcode => {
    const uri = `/${barcode}`;
    const url = deteAssetURL(uri);
    return nexusFetch(url);
};

export const servicingOrdersService = {
    getServicingOrders,
    getServicingOrderById,
    getFulfilmentOrdersForServiceOrder,
    getAdvancedFulfilmentOrdersForServiceOrder,
    saveFulfillmentOrder,
    exportServicingOrders,
};

export const getLateReasons = tenant => {
    const uri = `/late-faults?tenant=${tenant}`;
    const url = getApiURI('configuration', uri);

    return nexusFetch(url, {
        method: 'get',
    });
};
