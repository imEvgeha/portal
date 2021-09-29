import {get, isEmpty, isObject, merge} from 'lodash';
import config from 'react-global-configuration';
import {nexusFetch} from '../../util/http-client';

const FETCH_PAGE_SIZE = 100;

// Storing values for infinite loader fix
let allKeys = [];

export const getEventSearch = (params, page = 0, pageSize = FETCH_PAGE_SIZE, sortedParams) => {
    let paramString = '';

    // Build sortParams string if sortParams are provided
    if (!isEmpty(sortedParams)) {
        paramString = sortedParams.reduce((sortedParams, {colId, sort}) => `${sortedParams}${colId}=${sort};`, ';');
    }

    // Spice it up with some page and pageSize stuff
    paramString = `${paramString}?page=${page}&size=${pageSize}`;

    // Only fetch headers, not headers + data
    paramString += `&headersOnly=true`;

    // Build param string if params are provided
    if (!isEmpty(params)) {
        paramString = Object.keys(params).reduce((paramString, paramKey) => {
            // If we have a complex filter, break it down
            if (isObject(params[paramKey])) {
                const complexFilter = params[paramKey];

                // Converts '-From' and '-To' suffixes to '-Start' and '-End' respectively
                // and packs them into a param string
                // eslint-disable-next-line no-param-reassign
                paramString = Object.keys(complexFilter).reduce((paramString, key) => {
                    if (complexFilter[key]) {
                        let filterParamKey = key;

                        if (key.endsWith('From')) {
                            // eslint-disable-next-line no-magic-numbers
                            filterParamKey = `${key.slice(0, -4)}Start`;
                        } else if (key.endsWith('To')) {
                            // eslint-disable-next-line no-magic-numbers
                            filterParamKey = `${key.slice(0, -2)}End`;
                        }

                        return `${paramString}&${filterParamKey}=${complexFilter[key]}`;
                    }
                    return '';
                }, paramString);

                return paramString;
            }

            return `${paramString}&${paramKey}=${params[paramKey]}`;
        }, paramString);
    }

    const url = `${config.get('gateway.eventApiUrl')}${config.get('gateway.service.eventApiV2')}/search/fts`;

    return nexusFetch(`${url}${paramString}`).then(response => {
        const {data = []} = response || {};

        // Re-pack data to be more suitable for ag-grid consumption
        const formatedData = data.map((datum, i) => {
            const eventHeaders = get(datum, 'event.headers', {});
            const eventMessage = get(datum, 'event.message', {});
            const docId = get(datum, 'id', '');

            // Extracts keys from all incoming objects used for prevention ag-grid infinite loader in fields
            Object.keys(eventHeaders).length > allKeys.length && allKeys.push(Object.keys(eventHeaders));

            // Include `id` for ag-grid functionality and `message` for the EventDrawer
            return {...eventHeaders, id: docId, message: eventMessage};
        });

        // Format, convert and inject empty valued keys to prevent ag-grid infinite loader
        allKeys = allKeys.flat();
        allKeys = [...new Set(allKeys)];

        const allKeysObject = allKeys.reduce((o, key) => ({...o, [key]: ''}), {});
        const mergedData = formatedData.map(entry => merge({...allKeysObject, ...entry}));

        return {...response, data: mergedData};
    });
};

export const replayEvent = ({docId}) => {
    const url = `${config.get('gateway.eventApiUrl')}${config.get('gateway.service.eventApiV2')}/admin/replay/${docId}`;
    return nexusFetch(url, {
        method: 'post',
    });
};

export const replicateEvent = ({docId}) => {
    const url = `${config.get('gateway.eventApiUrl')}${config.get(
        'gateway.service.eventApiV2'
    )}/admin/replicate/${docId}`;
    return nexusFetch(url, {
        method: 'post',
    });
};

/**
 * Get Event Detail By Document Id
 * @param {Event} docId
 */
export const getEventById = docId => {
    const url = `${config.get('gateway.eventApiUrl')}${config.get('gateway.service.eventApiV2')}/event/${docId}`;
    return nexusFetch(url, {
        method: 'get',
    });
};
