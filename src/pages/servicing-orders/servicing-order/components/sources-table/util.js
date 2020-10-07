import {get, cloneDeep} from 'lodash';
import {getMgmAssetByBarcode, getMgmTitleByBarcode} from '../../../servicingOrdersService';

const Loading = 'loading...';

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
            const {barcode, title, version, assetFormat, standard, status} = s;
            if (barcode) {
                const source = get(preparedSources, barcode, {});
                preparedSources[barcode] = source;
                source.fs = fs;
                source.barcode = barcode;
                // source.title = title;
                // source.version = version;
                // source.status = status;
                // source.assetFormat = assetFormat;
                // source.standard = standard;
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
    const FO = cloneDeep(fulfillmentOrders);
    // eslint-disable-next-line array-callback-return
    FO.map(item => {
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
                    // eslint-disable-next-line no-return-assign
                    .then(res => (item.title = res[0].name || 'Not Found'))
                    // eslint-disable-next-line no-return-assign
                    .catch(err => (item.title = 'Failed'));
                getMgmAssetByBarcode(item.barcode)
                    .then(res => {
                        item.version = res.spec;
                        item.assetFormat = res.assetFormat;
                        item.standard = res.componentAssociations[0].component.standard;
                        item.status = res.status;
                        // eslint-disable-next-line no-unused-expressions
                        index === length - 1 ? setTimeout(() => setRefresh(), 500) : null;
                    })
                    .catch(err => {
                        item.version = 'Not Found';
                        item.status = 'Not Found';
                        item.assetFormat = 'Not Found';
                        item.standard = 'Not Found';
                    });
            });
    });
    return FO;
};
