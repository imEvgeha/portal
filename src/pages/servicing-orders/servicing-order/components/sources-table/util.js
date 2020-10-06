import {get} from 'lodash';
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
            const {barcode, title, titleId, amsAssetId, assetFormat, standard} = s;

            if (barcode) {
                const source = get(preparedSources, barcode, {});
                preparedSources[barcode] = source;
                source.fs = fs;
                source.barcode = barcode;
                source.title = title;
                source.titleId = titleId;
                source.amsAssetId = amsAssetId;
                source.assetFormat = assetFormat;
                source.standard = standard;
                const preparedServices = get(source, servicesKey, []);
                source[servicesKey] = preparedServices;
                return preparedServices.push(service);
            }
            return null;
        });
    });

    return Object.entries(preparedSources).map(([key, value]) => value);
};

export const populateMgmData = async fulfillmentOrders => {
    // eslint-disable-next-line array-callback-return
    const data = fulfillmentOrders.map(item => {
        if (item.definition.deteServices && item.definition.deteServices[0].deteSources.length)
            // eslint-disable-next-line array-callback-return
            item.definition.deteServices[0].deteSources.map(item => {
                item.title = Loading;
                item.titleId = Loading;
                item.amsAssetId = Loading;
                item.assetFormat = Loading;
                item.standard = Loading;
                getMgmTitleByBarcode(item.barcode)
                    // eslint-disable-next-line no-return-assign
                    .then(res => (item.title = res.name || 'Not Found'))
                    // eslint-disable-next-line no-return-assign
                    .catch(err => (item.title = 'Failed'));
                getMgmAssetByBarcode(item.barcode)
                    .then(res => {
                        item.titleId = Loading;
                        item.amsAssetId = Loading;
                        item.assetFormat = res.assetFormat;
                        item.standard = res.componentAssociations[0].component.standard;
                    })
                    .catch(err => {
                        item.titleId = 'Not Found';
                        item.amsAssetId = 'Not Found';
                        item.assetFormat = 'Not Found';
                        item.standard = 'Not Found';
                    });
            });
    });
    return fulfillmentOrders;
};
