import {cloneDeep, get, set} from 'lodash';
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
                source.tenant = data.tenant || '';
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

const getAudioComponents = (componentsObject, componentArray) => {
    componentArray
        .filter(item => item.component.componentType === 'AudioConfigurationComponent')
        .forEach((item, index) => {
            set(componentsObject, `audioComponents[${index}].trackConfiguration`, item.component.trackConfiguration);
            set(
                componentsObject,
                `audioComponents[${index}].language`,
                item.component.language || item.component.content
            );
            set(componentsObject, `audioComponents[${index}].contentType`, item.component.content);
            set(componentsObject, `audioComponents[${index}].components`, []);
            const components = get(item, 'component.components', []);
            components.forEach((comp, inx) => {
                set(componentsObject, `audioComponents[${index}].components[${inx}].channelNumber`, comp.channelNumber);
                set(
                    componentsObject,
                    `audioComponents[${index}].components[${inx}].channelPosition`,
                    comp.channelPosition
                );
                set(componentsObject, `audioComponents[${index}].components[${inx}].amsComponentId`, comp.deteId);
                set(
                    componentsObject,
                    `audioComponents[${index}].components[${inx}].sourceChannelNumber`,
                    comp.sourceChannelNumber
                );
                set(
                    componentsObject,
                    `audioComponents[${index}].components[${inx}].contentType`,
                    componentsObject.audioComponents[index].contentType
                );
                set(
                    componentsObject,
                    `audioComponents[${index}].components[${inx}].trackConfig`,
                    componentsObject.audioComponents[index].trackConfiguration
                );
                set(
                    componentsObject,
                    `audioComponents[${index}].components[${inx}].language`,
                    componentsObject.audioComponents[index].language
                );
            });
        });
};

const getSubtitleComponents = (componentsObject, componentArray) => {
    componentArray
        .filter(item => item.component.componentType === 'SubtitleComponent')
        .forEach((item, index) => {
            set(
                componentsObject,
                `subtitleComponents[${index}].language`,
                item.component.language || item.component.content
            );
            set(componentsObject, `subtitleComponents[${index}].format`, item.component.textType);
            set(componentsObject, `subtitleComponents[${index}].amsComponentId`, item.component.deteId);
        });
};

const getCaptionComponents = (componentsObject, componentArray) => {
    componentArray
        .filter(item => item.component.componentType === 'ClosedCaptionComponent')
        .forEach((item, index) => {
            set(
                componentsObject,
                `captionComponents[${index}].language`,
                item.component.language || item.component.content
            );
            set(componentsObject, `captionComponents[${index}].format`, item.component.textType);
            set(componentsObject, `captionComponents[${index}].amsComponentId`, item.component.deteId);
        });
};

// extract relevant info from componentAssociations array and return for display in UI
const getComponentsInfo = componentArray => {
    const componentsObject = {
        audioComponents: [],
        subtitleComponents: [],
        captionComponents: [],
    };

    getAudioComponents(componentsObject, componentArray);
    getSubtitleComponents(componentsObject, componentArray);
    getCaptionComponents(componentsObject, componentArray);

    return componentsObject;
};

export const fetchAssetFields = async barcode => {
    const title = await getDeteTitleByBarcode(barcode);
    const rest = await getDeteAssetByBarcode(barcode);
    return {title, ...rest};
};

/*
    function: fetchAssetInfo
    Arguments: [barcodes]: array of barcodes from getBarCodes()
    objective: fetch all relevant info from dete apis for each barcode
 */
export const fetchAssetInfo = async barcodes => {
    const components = [];
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
    const assetRequests = barcodes.map((item, index) => {
        return getDeteAssetByBarcode(item)
            .then(res => {
                const {spec, assetFormat, status} = res;
                components[index] = {
                    barcode: item,
                    components: getComponentsInfo(get(res, 'componentAssociations', [])),
                };
                return {
                    barcode: item,
                    version: spec || '',
                    assetFormat: assetFormat || '',
                    amsAssetId: item,
                    standard: get(res, 'componentAssociations[0].component.standard', ''),
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
    return [await Promise.all([...titleRequests, ...assetRequests]), components]; // Waiting for all the requests to get resolved.
};

/*
    function: getBarCodes
    Arguments: {fulfillmentOrders}: fo object
    objective: extract unique barcodes across all fo orders in a SO
 */
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

/*
    function: populateAssetInfo
    Arguments: {fulfillment}: fo object, [arr]: title and asset info obtained from DETE apis
    objective: insert asset info in fulfillment order for source table rows
 */
export const populateAssetInfo = (fulfillmentOrders, arr) => {
    const merged = [];

    // take data from title and asset api calls in arr and merge them in single array entry
    arr.forEach(item => {
        const inx = merged.findIndex(ee => ee.barcode === item.barcode);
        inx !== -1 ? (merged[inx] = {...merged[inx], ...item}) : merged.push(item);
    });
    const ffClone = cloneDeep(fulfillmentOrders);
    ffClone.forEach(item => {
        const length = Array.isArray(item.definition.deteServices)
            ? item.definition.deteServices[0].deteSources.length
            : 0;
        if (length > 0) {
            item.definition.deteServices[0].deteSources = item.definition.deteServices[0].deteSources.map(item => {
                const m = merged.findIndex(ee => ee.barcode === item.barcode);
                // put source table row info in [assetInfo] temporary property
                return m !== -1 ? {...item, assetInfo: merged[m]} : item;
            });
        }
    });
    return ffClone || {};
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

// make the fields empty in asset fields initially for loading indicator
export const showLoading = fulfillmentOrders => {
    fulfillmentOrders.forEach(item => {
        const length = Array.isArray(item.definition.deteServices)
            ? item.definition.deteServices[0].deteSources.length
            : 0;
        if (length > 0) {
            item.definition.deteServices[0].deteSources = item.definition.deteServices[0].deteSources.map(item => {
                return {
                    ...item,
                    assetInfo: {
                        barcode: item.barcode,
                        title: ' ',
                        version: ' ',
                        assetFormat: ' ',
                        standard: ' ',
                        status: ' ',
                    },
                };
            });
        }
    });
    return fulfillmentOrders;
};
