// TODO: Legacy. Needs refactor
/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

/**
 * Download File
 * @param {octet-stream} data - Byte array format (application/octet-stream)
 * @param {string} fileNamePrefix - Prefix for file naming
 * @param {string} fileExtension - File extension
 * @param {boolean} showTime - Show time in file name timestamp
 */
function downloadFile(data, fileNamePrefix = 'INT_avails_', fileExtension = '.xlsx', showTime = true, showDate = true) {
    // TODO: Header containing filename sugestion is not accesible by javascript by default,
    // additional changes on server required.
    // For now we recreate the filename using the same syntax as server
    const currentTime = new Date();
    let filename = fileNamePrefix;
    filename += showDate ? `${currentTime.getFullYear()}_${currentTime.getMonth() + 1}_${currentTime.getDate()}` : '';
    filename += showTime ? `_${currentTime.getHours()}_${currentTime.getMinutes()}_${currentTime.getSeconds()}` : '';
    filename += fileExtension;

    const url = window.URL.createObjectURL(new Blob([data], {type: 'application/octet-stream'}));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.click();
    window.URL.revokeObjectURL(url);
}

function safeTrim(value) {
    if (value === undefined || value === null) {
        return value;
    }
    if (typeof value === 'string') {
        return value.trim();
    }
    return value;
}

function equalOrIncluded(term, container) {
    let match = term === container;
    if (!match && container[0] === '[' && container[container.length - 1] === ']') {
        // if container is array
        // eslint-disable-next-line no-magic-numbers
        let terms = container.substr(1, container.length - 2);
        terms = terms.split(',').map(val => val.trim());
        match = terms.includes(term);
    } else if (!match && /^\w+\[\d\]$/.test(container)) {
        // if container matches the pattern `x[n]` where `x` is the name of an array, and `n` is any number
        // e.g. randomArrayName[0]
        const [matchedPattern] = /^\w+/.exec(container);
        return matchedPattern === term;
    }

    return match;
}

function momentToISO(date) {
    return moment(date).toISOString();
}

function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

function isObjectEmpty(obj) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

// used to replace default axios serializer which encodes using JSON encoding
function encodedSerialize(params) {
    return Object.entries(params)
        .map(x => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`)
        .join('&');
}

function prepareSortMatrixParam(sortedParams) {
    let matrix = '';
    if (sortedParams && Array.isArray(sortedParams)) {
        sortedParams.forEach(({id, colId, sort, desc}) => {
            matrix += `;${id || colId}=${sort || (desc ? 'DESC' : 'ASC')}`;
        });
    }
    return matrix;
}
function prepareSortMatrixParamTitles(sortedParams) {
    let matrix = '';
    if (sortedParams) {
        sortedParams.forEach(({id, colId, sort, desc}) => {
            matrix += `?sort=${id || colId},${sort || (desc ? 'DESC' : 'ASC')}`;
        });
    }
    return matrix;
}
function mergeDeep(target, source) {
    const output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, {[key]: source[key]});
                } else {
                    output[key] = mergeDeep(target[key], source[key]);
                }
            } else {
                Object.assign(output, {[key]: source[key]});
            }
        });
    }
    return output;
}

function getDeepValue(source, location) {
    const dotPos = location?.indexOf('.');
    if (dotPos > 0) {
        const firstKey = location.split('.')[0];
        const restKey = location.substring(dotPos + 1);
        if (source[firstKey]) {
            if (Array.isArray(source[firstKey])) {
                if (source[firstKey].length > 0) {
                    if (isObject(source[firstKey][0])) {
                        return source[firstKey].map(obj => obj[restKey]);
                    }
                    getDeepValue(source[firstKey], restKey);
                } else {
                    return [];
                }
            } else {
                return getDeepValue(source[firstKey], restKey);
            }
        }
        return null;
    }
    return source[location];
}

export const getSortedData = (data, prop, isAsc) => {
    return data.sort((a, b) => (a[prop] < b[prop] ? -1 : 1) * (isAsc ? 1 : -1));
};

function nextFrame(f) {
    setTimeout(f, 1);
}

const URL = {
    getParamIfExists(name, defaultValue = '') {
        const search = window.location.search.substring(1);
        const params = new URLSearchParams(search);
        return params.get(name) || defaultValue;
    },

    getBooleanParam(name, defaultValue = false) {
        const val = this.getParamIfExists(name, null);
        if (val === 'true') {
            return true;
        }
        return defaultValue;
    },

    isEmbedded() {
        return this.getBooleanParam('embedded');
    },

    keepEmbedded(url) {
        let parts = '';
        if (this.isEmbedded()) {
            if (typeof url === 'string' && url?.indexOf('embedded=true') > 0) {
                return url;
            }
            parts = url.split('?');
            if (parts.length === 2) {
                return `${parts[0]}?embedded=true&${parts[1]}`;
            }
            return `${parts[0]}?embedded=true`;
        }
        return url;
    },

    search: () => {
        if (window && window.location) {
            return window.location.search;
        }
        return null;
    },

    updateQueryParam: values => {
        // values = {date: '12/12/12'}
        const search = window.location.search.substring(1);
        const params = new URLSearchParams(search);
        Object.keys(values).forEach(key => {
            if (values[key]) {
                params.set(key, values[key]);
            } else {
                params.delete(key);
            }
        });
        return params.toString();
    },

    isLocalOrDevOrQAOrStg() {
        const host = window.location.hostname;
        return host.includes('localhost') || host.includes('.qa.') || host.includes('.dev.') || host.includes('.stg.');
    },

    isLocalOrDevOrQA() {
        const host = window.location.hostname;
        return host.includes('localhost') || host.includes('.qa.') || host.includes('.dev.');
    },

    isLocalOrDev() {
        const host = window.location.hostname;
        return host.includes('localhost') || host.includes('.dev.');
    },
};

// TODO: transform this to simple helper function - no need for React Component
const IfEmbedded = ({value, children}) => <>{URL.isEmbedded() === value && children}</>;

IfEmbedded.propTypes = {
    value: PropTypes.bool,
};

IfEmbedded.defaultProps = {
    value: true,
};
const switchCase = cases => defaultCase => key => (cases.hasOwnProperty(key) ? cases[key] : defaultCase);

const getDomainName = () => window && window.location.origin.toString();

const minTwoDigits = n => `${n < 10 ? '0' : ''}${n}`;

const formatNumberTwoDigits = number => {
    const n = parseInt(number);
    if (n) {
        if (n > 0 && n < 10) {
            return `0${n}`;
        }
        return n;
    }
    return '';
};

const normalizeDataForStore = data => {
    if (Array.isArray(data)) {
        return data.reduce((obj, item) => {
            if (item.id) {
                obj[item.id] = item;
            }
            return obj;
        }, {});
    }
};

const cleanObject = function (object, allowEmptyStrings = false) {
    Object.entries(object).forEach(([k, v]) => {
        if (v && typeof v === 'object') {
            cleanObject(v);
        }
        if (
            (v && typeof v === 'object' && !Object.keys(v).length) ||
            v === null ||
            v === undefined ||
            (!allowEmptyStrings && v.length === 0)
        ) {
            if (Array.isArray(object)) {
                object.splice(k, 1);
            } else if (!(v instanceof Date)) {
                delete object[k];
            }
        }
    });
    return object;
};

const lazyWithPreload = factory => {
    const Component = React.lazy(factory);
    Component.preload = factory;
    return Component;
};

export {
    downloadFile,
    momentToISO,
    isObject,
    mergeDeep,
    prepareSortMatrixParam,
    safeTrim,
    equalOrIncluded,
    getDeepValue,
    prepareSortMatrixParamTitles,
    isObjectEmpty,
    encodedSerialize,
    nextFrame,
    URL,
    IfEmbedded,
    switchCase,
    getDomainName,
    minTwoDigits,
    formatNumberTwoDigits,
    normalizeDataForStore,
    cleanObject,
    lazyWithPreload,
};
