import {get, cloneDeep} from 'lodash';
import {getMgmAssetByBarcode, getMgmTitleByBarcode} from '../../../servicingOrdersService';

const Loading = 'loading...';
const NotFound = 'Not Found';
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
    const title = await getMgmTitleByBarcode(barcode);
    const rest = await getMgmAssetByBarcode(barcode);
    return {title, ...rest};
};

export const populateMgmData = (fulfillmentOrders, setRefresh) => {
    if (!Array.isArray(fulfillmentOrders)) return [];
    const fulfillmentOrdersWithAssetInfo = cloneDeep(fulfillmentOrders);
    // eslint-disable-next-line array-callback-return
    fulfillmentOrdersWithAssetInfo.map(item => {
        const length = Array.isArray(item.definition.deteServices)
            ? item.definition.deteServices[0].deteSources.length
            : 0;
        if (length > 0)
            // eslint-disable-next-line array-callback-return
            item.definition.deteServices[0].deteSources.map((item, index) => {
                item.title = Loading;
                item.version = Loading;
                item.assetFormat = Loading;
                item.standard = Loading;
                item.status = Loading;
                getMgmTitleByBarcode(item.barcode)
                    .then(res => (item.title = res[0].name || NotFound))
                    .catch(err => (item.title = NotFound));
                getMgmAssetByBarcode(item.barcode)
                    .then(res => {
                        const {spec, assetFormat, componentAssociations, status} = res;
                        item.version = spec || NotFound;
                        item.assetFormat = assetFormat || NotFound;
                        item.standard = componentAssociations[0].component.standard || NotFound;
                        item.status = status || NotFound;
                        // eslint-disable-next-line no-unused-expressions
                        index === length - 1 ? setTimeout(() => setRefresh(), REFRESH_TIME) : null;
                    })
                    .catch(err => {
                        item.version = NotFound;
                        item.status = NotFound;
                        item.assetFormat = NotFound;
                        item.standard = NotFound;
                    });
            });
    });
    return fulfillmentOrdersWithAssetInfo;
};
