import {cloneDeep, get} from 'lodash';
import {getDeteAssetByBarcode, getDeteTitleByBarcode} from '../../../servicingOrdersService';

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
    const title = await getDeteTitleByBarcode(barcode);
    const rest = await getDeteAssetByBarcode(barcode);
    return {title, ...rest};
};

export const fetchAssetInfo = async barcodes => {
    const titleRequests = barcodes.map(item => {
        return getDeteTitleByBarcode(item)
            .then(res => {
                const arr = res || [];
                return {
                    barcode: item,
                    title: arr[0].name || '',
                };
            })
            .catch(() => {
                return {
                    barcode: item,
                    title: '',
                    version: '',
                    assetFormat: '',
                    standard: '',
                    status: '',
                };
            });
    });
    const assetRequests = barcodes.map(item => {
        return getDeteAssetByBarcode(item)
            .then(res => {
                const {spec, assetFormat, componentAssociations = [], status} = res;
                return {
                    barcode: item,
                    version: spec || '',
                    assetFormat: assetFormat || '',
                    amsAssetId: item,
                    standard: componentAssociations[0].component.standard || '',
                    status: status || '',
                };
            })
            .catch(() => {
                return {
                    barcode: item,
                    version: '',
                    assetFormat: '',
                    standard: '',
                    status: '',
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

    arr.forEach(item => {
        const inx = merged.findIndex(ee => ee.barcode === item.barcode);
        inx !== -1 ? (merged[inx] = {...merged[inx], ...item}) : merged.push(item);
    });

    fulfillmentOrders.forEach(item => {
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

// remove null or empty deteSources from deteSources array
export const removeNulls = fulfillmentOrders => {
    fulfillmentOrders.forEach(item => {
        const length = get(item, 'definition.deteServices[0].deteSources.length', 0);
        if (length > 0) {
            item.definition.deteServices[0].deteSources = item.definition.deteServices[0].deteSources.filter(
                item => item !== null
            );
        }
    });
};

// make the fields empty in asset fields temporarily...
export const showLoading = fulfillmentOrders => {
    const foClone = cloneDeep(fulfillmentOrders);

    foClone.forEach(item => {
        const length = Array.isArray(item.definition.deteServices)
            ? item.definition.deteServices[0].deteSources.length
            : 0;
        if (length > 0) {
            item.definition.deteServices[0].deteSources = item.definition.deteServices[0].deteSources.map(item => {
                return {
                    ...item,
                    title: ' ',
                    version: ' ',
                    assetFormat: ' ',
                    standard: ' ',
                    status: ' ',
                };
            });
        }
    });
    return foClone;
};
