import {getApiURI} from '@vubiquity-nexus/portal-utils/lib/config';
import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {get, isEmpty, isObject, merge} from 'lodash';
import moment from 'moment';

const FETCH_PAGE_SIZE = 100;

// Storing values for infinite loader fix
let allKeys = [];

// eslint-disable-next-line max-params
export const getEventSearch = (params, page = 0, pageSize = FETCH_PAGE_SIZE, sortedParams, body) => {
    let paramString = '';
    // Build sortParams string if sortParams are provided
    if (!isEmpty(sortedParams)) {
        paramString = sortedParams.reduce((sortedParams, {colId, sort}) => `${sortedParams}${colId}=${sort};`, ';');
    }

    // Spice it up with some page and pageSize stuff
    paramString = `${paramString}?page=${page}&size=${pageSize}`;

    // Only fetch headers, not headers + data
    paramString += `&headersOnly=true`;

    const isKeyEqualPostedTimeStamp = elem => elem !== 'postedTimeStamp';
    // Build param string if params are provided
    if (!isEmpty(params)) {
        paramString = Object.keys(params)
            .filter(isKeyEqualPostedTimeStamp)
            .reduce((paramString, paramKey) => {
                // If we have a complex filter, break it down
                if (isObject(params[paramKey])) {
                    const complexFilter = params[paramKey];
                    // Converts '-From' and '-To' suffixes to '-Start' and '-End' respectively
                    // and packs them into a param string
                    // eslint-disable-next-line no-param-reassign
                    paramString = Object.keys(complexFilter).reduce((paramString, key) => {
                        if (complexFilter[key]) {
                            let filterParamKey = key;
                            const utcDate = moment(complexFilter[key]).utc(false);
                            const localDate = moment(complexFilter[key]).utc(true);
                            const amountHoursToAddOrSubtract = utcDate.hours() - localDate.hours();
                            const amountMinutesToAddOrSubtract = utcDate.minutes() - localDate.minutes();
                            const rightHours =
                                amountHoursToAddOrSubtract < 0
                                    ? utcDate.subtract(Math.abs(amountHoursToAddOrSubtract), 'hours').toISOString()
                                    : utcDate.add(amountHoursToAddOrSubtract, 'hours').toISOString();
                            const rightMinutes =
                                amountMinutesToAddOrSubtract < 0
                                    ? utcDate.subtract(Math.abs(amountMinutesToAddOrSubtract), 'minutes').toISOString()
                                    : utcDate.add(amountMinutesToAddOrSubtract, 'minutes').toISOString();
                            const dateForLocalRequest = () => {
                                if (amountHoursToAddOrSubtract !== 0) return rightHours;
                                if (amountMinutesToAddOrSubtract !== 0) return rightMinutes;
                                return utcDate.toISOString();
                            };

                            if (key.endsWith('From')) {
                                // eslint-disable-next-line no-magic-numbers
                                filterParamKey = `${key.slice(0, -4)}Start`;
                            } else if (key.endsWith('To')) {
                                // eslint-disable-next-line no-magic-numbers
                                filterParamKey = `${key.slice(0, -2)}End`;
                            }
                            return `${paramString}&${filterParamKey}=${
                                body.isLocal ? dateForLocalRequest() : complexFilter[key]
                            }`;
                        }
                        return '';
                    }, paramString);

                    return paramString;
                }

                return `${paramString}&${paramKey}=${params[paramKey]}`;
            }, paramString);
    }

    const uri = `/search/fts`;
    const url = getApiURI('event', uri, 2);

    return nexusFetch(`${url}${paramString}`).then(response => {
        const {data = []} = response || {};

        // Re-pack data to be more suitable for ag-grid consumption
        const formatedData = data.map(datum => {
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
    const uri = `/admin/replay/${docId}`;
    const url = getApiURI('event', uri, 2);

    return nexusFetch(url, {
        method: 'post',
    });
};

export const replicateEvent = ({docId}) => {
    const uri = `/admin/replicate/${docId}`;
    const url = getApiURI('event', uri, 2);

    return nexusFetch(url, {
        method: 'post',
    });
};

/**
 * Get Event Detail By Document Id
 * @param {Event} docId
 */
export const getEventById = docId => {
    const uri = `/event/${docId}`;
    const url = getApiURI('event', uri, 2);

    return nexusFetch(url, {
        method: 'get',
    });
};
