import moment from 'moment';
import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {store} from '../../../../../index';
import {
    encodedSerialize,
    momentToISO,
    prepareSortMatrixParam,
    safeTrim,
} from '@vubiquity-nexus/portal-utils/lib/Common';
import {
    ARRAY_OF_OBJECTS,
    MULTI_INSTANCE_OBJECTS_IN_ARRAY_HACKED_FIELDS,
    STRING_TO_ARRAY_OF_STRINGS_HACKED_FIELDS,
} from './Constants';
import {getConfig} from '@vubiquity-nexus/portal-utils/lib/config';

const isNotEmpty = function (obj) {
    if (Array.isArray(obj)) {
        return obj.length > 0;
    }
    return obj && safeTrim(obj);
};

const parse = (value, key) => {
    if (typeof value === 'number' || typeof value === 'boolean') return value;

    if (typeof value === 'string') return safeTrim(value);

    if (value instanceof moment) {
        return momentToISO(value);
    }

    if (ARRAY_OF_OBJECTS.includes(key)) {
        return value;
    }

    if (Array.isArray(value)) return value.map(val => parse(val));

    if (value && 'value' in value) return parse(value.value);

    return null;
};

const populate = function (key, value, location) {
    const dotPos = key.indexOf('.');
    if (key && dotPos > 0) {
        const firstKey = key.split('.')[0];
        const restKey = key.substring(dotPos + 1);
        if (MULTI_INSTANCE_OBJECTS_IN_ARRAY_HACKED_FIELDS.includes(firstKey)) {
            if (!location[firstKey]) location[firstKey] = [];
            const container = location[firstKey];
            if (value) {
                value = parse(value);
                if (typeof value === 'string') {
                    value = parse(value.split(','));
                }
                for (let i = 0; i < value.length; i++) {
                    if (container.length <= i) {
                        container.push({[restKey]: value[i]});
                    } else {
                        container[i][restKey] = value[i];
                    }
                }
            }
        } else {
            if (!location[firstKey]) location[firstKey] = {};
            if (typeof value === 'string' && STRING_TO_ARRAY_OF_STRINGS_HACKED_FIELDS.includes(key)) {
                value = value.split(',');
            }
            populate(restKey, value, location[firstKey]);
        }
    } else {
        if (typeof value === 'string' && STRING_TO_ARRAY_OF_STRINGS_HACKED_FIELDS.includes(key)) {
            // If value is an empty string, convert to an empty array
            // .split() converts '' to [''] which is not desirable (BE error)
            value = value ? value.split(',') : [];
        }
        location[key] = parse(value, key);
    }
};

export const prepareRight = function (right, keepNulls = false) {
    const rightCopy = {};
    Object.keys(right).forEach(key => {
        if (keepNulls || isNotEmpty(right[key])) {
            populate(key, right[key], rightCopy);
        }
    });
    return rightCopy;
};

const parseAdvancedFilter = function (searchCriteria) {
    const rootStore = store.getState().root;
    const mappings = rootStore?.availsMapping?.mappings;
    let params = {};

    function isQuoted(value) {
        return value[0] === '"' && value[value.length - 1] === '"';
    }

    for (let key in searchCriteria) {
        if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
            let value = searchCriteria[key]?.filter || searchCriteria[key]?.values.toString();

            // TODO: temporary workaround for territory field (BE doesn't filter items via 'territory=CA', etc.)
            if (key === 'territory') {
                const updatedKey = `${key}Country`;
                params[updatedKey] = value;
                continue;
            }
            if (value instanceof Object) {
                params = {
                    ...params,
                    ...value,
                };
                continue;
            }
            const map = mappings?.find(({queryParamName}) => queryParamName === key);
            if (map && map.searchDataType === 'string') {
                if (isQuoted(value)) {
                    value = value.substr(1, value.length - 2);
                } else {
                    key += 'Match';
                }
            }
            params[key] = value;
        }
    }

    return params;
};

const parseAdvancedFilterV2 = function (searchCriteria, filtersInBody) {
    const rootStore = store.getState().root;
    const mappings = rootStore?.availsMapping?.mappings;
    let params = {};
    function isQuoted(value) {
        return value[0] === '"' && value[value.length - 1] === '"';
    }

    for (let key in searchCriteria) {
        if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
            let value = searchCriteria[key];
            // TODO: temporary workaround for territory field (BE doesn't filter items via 'territory=CA', etc.)
            if (key === 'territory') {
                const updatedKey = `${key}Country`;
                params[updatedKey] = value;
                continue;
            }
            if (value instanceof Object && !Array.isArray(value)) {
                // is date range
                for (let keyDate in value) {
                    params[keyDate] = value[keyDate];
                }
                continue;
            }
            const map = mappings?.find(
                ({queryParamName, javaVariableName, dataType}) =>
                    (queryParamName === key || javaVariableName === key) && dataType !== 'icon'
            );

            let keyValue = map?.queryParamName || key;
            if (key === 'selected' || key === 'withdrawn') {
                keyValue = `${key}FlattenList`;
                value = value.split(',').map(v => `${v}true`.trim());
            }
            if (filtersInBody && (map.searchDataType === 'multiselect' || map.searchDataType === 'stringToArray')) {
                // change key - add List
                keyValue = `${keyValue}List`;
                //  Convert Comma Separated String into an Array
                if (typeof value === 'string') {
                    value = value.split(', ');
                }
            }

            if (map?.searchDataType === 'boolean') {
                value = JSON.parse(value);
            }

            if (map?.searchDataType === 'string') {
                if (isQuoted(value)) {
                    value = value.substr(1, value.length - 2);
                } else if (!map.nonMatchingValue) {
                    keyValue += 'Match';
                }
            }
            params[keyValue] = value;
        }
    }

    return params;
};

export const rightsService = {
    freeTextSearch: (searchCriteria, page, size, sortedParams) => {
        const queryParams = {};
        if (searchCriteria.text) {
            queryParams.text = searchCriteria.text;
        }
        const url =
            getConfig('gateway.url') +
            getConfig('gateway.service.avails') +
            '/rights' +
            prepareSortMatrixParam(sortedParams);
        const params = encodedSerialize({...queryParams, page, size});
        return nexusFetch(url, {params});
    },

    advancedSearch: (searchCriteria, page, size, sortedParams) => {
        const queryParams = parseAdvancedFilter(searchCriteria);
        const url = `${getConfig('gateway.url')}${getConfig('gateway.service.avails')}/rights${prepareSortMatrixParam(
            sortedParams
        )}`;
        const params = encodedSerialize({...queryParams, page, size});
        return nexusFetch(url, {params});
    },

    advancedSearchV2: (queryParams, page, size, sortedParams, body) => {
        const url =
            getConfig('gateway.url') +
            getConfig('gateway.service.avails') +
            '/rights/search' +
            prepareSortMatrixParam(sortedParams);
        const params = encodedSerialize({...queryParams, page, size});
        return nexusFetch(url, {params, method: 'post', body: JSON.stringify(body)});
    },

    create: (right, options = {isWithErrorHandling: true}) => {
        const url = getConfig('gateway.url') + getConfig('gateway.service.avails') + '/rights';
        const data = prepareRight(right);
        const {isWithErrorHandling} = options || {};
        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(data),
            isWithErrorHandling,
        });
    },

    get: (id, options = {isWithErrorHandling: false}) => {
        const url = getConfig('gateway.url') + getConfig('gateway.service.avails') + '/rights/' + id;
        const {isWithErrorHandling} = options || {};
        return nexusFetch(url, isWithErrorHandling);
    },

    update: (rightDiff, id) => {
        const url = getConfig('gateway.url') + getConfig('gateway.service.avails') + `/rights/${id}`;
        const data = prepareRight(rightDiff, true);
        return nexusFetch(url, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    bulkUpdate: payload => {
        const url = getConfig('gateway.url') + getConfig('gateway.service.avails') + `/rights/bulk-partial-update`;
        return nexusFetch(url, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
    },

    updateRightWithFullData: (right, id, isFormatted = false, isWithErrorHandling = false) => {
        const url = getConfig('gateway.url') + getConfig('gateway.service.avails') + `/rights/${id}`;
        const data = isFormatted ? right : prepareRight(right, true);
        return nexusFetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            isWithErrorHandling,
        });
    },

    delete: (selectedRightIds, impactedRightIds) => {
        const url = `${getConfig('gateway.url')}${getConfig('gateway.service.avails')}/rights/delete`;
        const data = {
            selectedRightIds,
            impactedRightIds,
        };
        return nexusFetch(url, {method: 'post', body: JSON.stringify(data)});
    },

    findBonusAndTPRsToBeDeleted: selectedRightIds => {
        const url = `${getConfig('gateway.url')}${getConfig(
            'gateway.service.avails'
        )}/rights/findBonusAndTPRsToBeDeleted`;
        const data = {
            selectedRightIds,
        };
        return nexusFetch(url, {method: 'post', body: JSON.stringify(data)});
    },
};

export {parseAdvancedFilter, parseAdvancedFilterV2};
