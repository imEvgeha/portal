import {encodedSerialize, prepareSortMatrixParam} from '@vubiquity-nexus/portal-utils/lib/Common';
import {getConfig} from "@vubiquity-nexus/portal-utils/lib/config";
import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';

const baseServicingOrdersURL = () => {
    return `${getConfig('gateway.servicingOrdersUrl')}${getConfig('gateway.service.servicingOrder')}`;
};

const deteAssetURL = () => {
    return `${getConfig('gateway.deteBaseUrl')}${getConfig('gateway.service.deteAsset')}`;
};

const deteTitleURL = () => {
    return `${getConfig('gateway.deteBaseUrl')}${getConfig('gateway.service.deteTitle')}`;
};

export const getSpecOptions = (recipientId, tenant) => {
    const url = `${getConfig(
        'gateway.deteBaseUrl'
    )}/outputFormats?recipientId=${recipientId}&tenant=${tenant}&sort=OUTPUTTEMPLATEID`;
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
    const url = `${baseServicingOrdersURL()}/search/so${prepareSortMatrixParam(defaultSort)}`;
    const params = encodedSerialize({...queryParams, page, size});
    return nexusFetch(url, {params});
};

export const getServicingOrderById = id => {
    const url = `${baseServicingOrdersURL()}/so/${id}`;
    return nexusFetch(url);
};

export const getFulfilmentOrdersForServiceOrder = id => {
    const url = `${baseServicingOrdersURL()}/so/${id}/fo`;
    return nexusFetch(url);
};

export const getFilteredByTitleOrders = (id, type, status, page) => {
    const newType = type === 'TITLE_ASCENDING' ? 'ASC' : 'DESC';

    const url = `${baseServicingOrdersURL()}/so/${id}/soi;product_description=${newType}/fo?soiStatus=${status}&page=${
        page - 1
    }&size=100`;
    return nexusFetch(url);
};

export const getFilteredByIdOrders = (id, type, status, page) => {
    const newType = type === 'ID_ASCENDING' ? 'ASC' : 'DESC';

    const url = `${baseServicingOrdersURL()}/so/${id}/soi;external_id=${newType}/fo?soiStatus=${status}&page=${
        page - 1
    }&size=100`;
    return nexusFetch(url);
};

export const getAdvancedFulfilmentOrdersForServiceOrder = (id, page, size) => {
    const url = `${baseServicingOrdersURL()}/so/${id}/soi;external_id=ASC/fo?soiStatus=All&page=${page}&size=${size}`;
    return nexusFetch(url);
};

export const getServiceRequest = externalId => {
    const url = `${baseServicingOrdersURL()}/so/${externalId}/pr`;
    return nexusFetch(url, {
        method: 'get',
    });
};

export const saveFulfillmentOrder = ({data}) => {
    const url = `${baseServicingOrdersURL()}/fo`;
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
    const url = `${baseServicingOrdersURL()}/so/export`;
    return nexusFetch(url, {
        method: 'post',
        body: JSON.stringify(servicingOrders),
    });
};

export const getDeteTitleByBarcode = barcode => {
    const url = `${deteTitleURL()}/assetId/${barcode}`;
    return nexusFetch(url);
};

export const getDeteAssetByBarcode = barcode => {
    const url = `${deteAssetURL()}/${barcode}`;
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

const lateFaultsURL = () => {
    return `${getConfig('gateway.configuration')}${getConfig('gateway.service.configuration')}${getConfig(
        'gateway.service.lateFaults'
    )}`;
};

export const getLateReasons = tenant => {
    // https://configapi.dev.vubiquity.com/configuration-api/v1/late-faults?tenant="MGM"
    const url = `${lateFaultsURL()}?tenant=${tenant}`;
    return nexusFetch(url, {
        method: 'get',
    });
};
