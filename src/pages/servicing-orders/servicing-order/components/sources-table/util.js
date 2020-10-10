import {cloneDeep, get} from 'lodash';
import {getMgmAssetByBarcode, getMgmTitleByBarcode} from '../../../servicingOrdersService';

const Loading = 'loading...';
const NotFound = 'Not Found';
const ApiError = 'API error';
const REFRESH_TIME = 500;

export const prepareRowData = data => {
    const {fs, definition = {}} = data || {};

    if (!fs) {
        return [];
    }

    const preparedSources = {};

    const servicesKey = `${fs.toLowerCase()}Services`;
    const sourcesKey = `${fs.toLowerCase()}Sources`;

    const services = get(definition, servicesKey, []);

    services.forEach(service => {
        const sources = get(service, sourcesKey, []);
        sources.map(s => {
            const {barcode} = s;
            if (barcode) {
                const source = get(preparedSources, barcode, {});
                preparedSources[barcode] = source;
                source.fs = fs;
                source.barcode = barcode;
                const preparedServices = get(source, servicesKey, []);
                source[servicesKey] = preparedServices;
                return preparedServices.push(service);
            }
            return null;
        });
    });

    return Object.entries(preparedSources).map(([key, value]) => value);
};

export const fetchAssetFields = async barcode => {
    try {
        const title = await getMgmTitleByBarcode(barcode);
        const rest = await getMgmAssetByBarcode(barcode);
        return {title, ...rest};
    } catch (e) {
        return e;
    }
};

export const fetchAssetInfo = async barcodes => {
    const titleRequests = barcodes.map(item => {
        return getMgmTitleByBarcode(item)
            .then(res => {
                const arr = res || [];
                return {
                    barcode: item,
                    title: arr[0].name || NotFound,
                };
            })
            .catch(() => {
                return {
                    barcode: item,
                    title: ApiError,
                    version: ApiError,
                    assetFormat: ApiError,
                    standard: ApiError,
                    status: ApiError,
                };
            });
    });
    const assetRequests = barcodes.map(item => {
        return getMgmAssetByBarcode(item)
            .then(res => {
                const {spec, assetFormat, componentAssociations = [], status} = res;
                return {
                    barcode: item,
                    version: spec || NotFound,
                    assetFormat: assetFormat || NotFound,
                    standard: componentAssociations[0].component.standard || NotFound,
                    status: status || NotFound,
                };
            })
            .catch(() => {
                return {
                    barcode: item,
                    version: ApiError,
                    assetFormat: ApiError,
                    standard: ApiError,
                    status: ApiError,
                };
            });
    });
    return Promise.all([...titleRequests, ...assetRequests]); // Waiting for all the requests to get resolved.
};

// get unique barcodes in fulfillment order for optimum api use
export const getBarCodes = fulfillmentOrders => {
    if (!Array.isArray(fulfillmentOrders)) return [];
    const barcodes = new Set();
    // eslint-disable-next-line array-callback-return
    fulfillmentOrders.map(item => {
        const length = Array.isArray(item.definition.deteServices)
            ? item.definition.deteServices[0].deteSources.length
            : 0;
        if (length > 0)
            // eslint-disable-next-line array-callback-return
            item.definition.deteServices[0].deteSources.map((item, index) => {
                barcodes.add(item.barcode.trim());
            });
    });
    return [...barcodes];
};

// populate asset info in nested fulfillmentorders object
export const populateAssetInfo = (fulfillmentOrders, arr) => {
    const merged = [];
    // eslint-disable-next-line array-callback-return
    arr.map(item => {
        const inx = merged.findIndex(ee => ee.barcode === item.barcode);
        inx !== -1 ? (merged[inx] = {...merged[inx], ...item}) : merged.push(item);
    });
    // eslint-disable-next-line array-callback-return
    fulfillmentOrders.map(item => {
        const length = Array.isArray(item.definition.deteServices)
            ? item.definition.deteServices[0].deteSources.length
            : 0;
        if (length > 0) {
            item.definition.deteServices[0].deteSources = item.definition.deteServices[0].deteSources.map(item => {
                const m = merged.findIndex(ee => ee.barcode === item.barcode);
                return m !== -1 ? {...merged[m]} : item;
            });
        }
    });
    return fulfillmentOrders;
};

// show 'loading...' in asset fields temporarily
export const populateLoading = fulfillmentOrders => {
    const foClone = cloneDeep(fulfillmentOrders);
    // eslint-disable-next-line array-callback-return
    foClone.map(item => {
        const length = Array.isArray(item.definition.deteServices)
            ? item.definition.deteServices[0].deteSources.length
            : 0;
        if (length > 0) {
            // eslint-disable-next-line array-callback-return
            item.definition.deteServices[0].deteSources.map(item => {
                item.title = Loading;
                item.version = Loading;
                item.assetFormat = Loading;
                item.standard = Loading;
                item.status = Loading;
            });
        }
    });
    return foClone;
};
