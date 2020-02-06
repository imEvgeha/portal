import moment from 'moment';
import React, {Fragment} from 'react';
import t from 'prop-types';


function downloadFile(data) {
    //header containing filename sugestion is not accesible by javascript by default, aditional changes on server required
    //for now we recreate the filename using the same syntax as server
    const currentTime = new Date();
    let filename = 'INT_avails_';
    filename += currentTime.getFullYear() + '_' + (currentTime.getMonth() + 1) + '_' + currentTime.getDate() + '_';
    filename += currentTime.getHours() + '_' + currentTime.getMinutes() + '_' + currentTime.getSeconds();
    filename += '.xlsx';

    const url = window.URL.createObjectURL(new Blob([data], {type: 'application/octet-stream'}));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.click();
    window.URL.revokeObjectURL(url);
}

function safeTrim(value){
    if(value === undefined || value === null) return value;
    if(typeof value === 'string'){
        return value.trim();
    }else{
        return value;
    }
}

function equalOrIncluded(term, container){
    let match = term === container;
    if(!match && container[0] === '[' && container[container.length-1] === ']') {
        //if container is array
        let terms = container.substr(1, container.length -2);
        terms = terms.split(',').map((val) => val.trim());
        match = terms.includes(term);
    }

    return match;
}

function momentToISO(date) {
    return moment(date).toISOString();
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function isObjectEmpty(obj) {
    for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

//used to replace default axios serializer which encodes using JSON encoding
const encodedSerialize = function(params){
    return Object.entries(params).map(x => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`).join('&');
};

function prepareSortMatrixParam(sortedParams) {
    let matrix = '';
    if(sortedParams){
        sortedParams.forEach((entry) => {
            matrix += ';' + entry.id + '=' + (entry.desc ? 'DESC' : 'ASC');
        });
    }
    return matrix;
}
function prepareSortMatrixParamTitles(sortedParams) {
    let matrix = '';
        if(sortedParams){
            sortedParams.forEach((entry) => {
                matrix += '?sort=' + entry.id + ',' + (entry.desc ? 'DESC' : 'ASC');
            });
        }
    return matrix;
}
function mergeDeep(target, source) {
    let output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, { [key]: source[key] });
                else
                    output[key] = mergeDeep(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

function getDeepValue(source, location){
    const dotPos = location.indexOf('.');
    if(dotPos > 0) {
        const firstKey = location.split('.')[0];
        const restKey = location.substring(dotPos+1);
        if(source[firstKey]){
            if(Array.isArray(source[firstKey])) {
                if(source[firstKey].length > 0) {
                    if(isObject(source[firstKey][0])){
                        return source[firstKey].map(obj => obj[restKey]);
                    }else{
                        getDeepValue(source[firstKey], restKey);
                    }
                }else{
                    return [];
                }
            }else{
                return getDeepValue(source[firstKey], restKey);
            }
        }
        return null;
    }else{
        return source[location];
    }
}

export const getSortedData = (data, prop, isAsc) => {
    return data.sort((a, b) => (a[prop] < b[prop] ? -1 : 1) * (isAsc ? 1 : -1));
};

function nextFrame(f){
    setTimeout(f, 1);
}


const URL = {
    getParamIfExists: function (name, defaultValue = ''){
        let toReturn = defaultValue;
        if (this.search()){
            let query = this.search().substring(1);
            let params = query.split('&');
            let param = params.find((param) => param.split('=').length === 2 && param.split('=')[0] === name);
            if(param){
                toReturn =  param.split('=')[1];
            }
        }
        return toReturn;
    },

    getBooleanParam: function(name, defaultValue = false) {
        const val = this.getParamIfExists(name, null);
        if(val === 'true'){
            return true;
        }
        return defaultValue;
    },

    isEmbedded: function(){
        return this.getBooleanParam('embedded');
    },

    keepEmbedded: function(url) {
        let parts;
        if(this.isEmbedded()){
            if(url.indexOf('embedded=true') > 0){
                return url;
            }else{
                parts = url.split('?');
                if(parts.length === 2){
                    return parts[0] + '?embedded=true&' + parts[1];
                }else{
                    return parts[0] + '?embedded=true';
                }
            }
        }
        return url;
    },

    search: function() {
        if(window && window.location){
            return window.location.search;
        } return null;
    },

    updateQueryParam: values => {     //values = {date: '12/12/12'}
        const search = window.location.search.substring(1);
        let params =  new URLSearchParams(search);
        Object.keys(values).forEach(key => {
            if(values[key]) params.set(key, values[key]);
            else params.delete(key);
        });
        return params.toString();
    }
};

class IfEmbedded extends React.Component {
    static propTypes = {
        children: t.any,
        value:t.bool
    }

    static defaultProps = {
        value: true
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                {URL.isEmbedded() === this.props.value && this.props.children}
            </Fragment>
        );
    }
}

const switchCase = cases => defaultCase => key => cases.hasOwnProperty(key) ? cases[key] : defaultCase;

const getDomainName = () => window && window.location.origin.toString();

const minTwoDigits = n => `${n < 10 ? '0' : ''}${n}`;

// Create date format based on locale
const getDateFormatBasedOnLocale = (locale) => (moment().locale(locale).localeData().longDateFormat('L'));

// Attach (UTC) to date, if it is simulcast
const parseSimulcast = (date = null, dateFormat, isTimeVisible = true) => {
    const isUTC = date && date.endsWith('Z');
    return moment(date).isValid()
        ? `${moment(date).utc(!isUTC).format(dateFormat)}${isUTC && isTimeVisible? ' (UTC)' : ''}`
        : 'Invalid Date';
};


const formatNumberTwoDigits = (number) => {
    const n = parseInt(number);
    if(n) {
        if(n > 0 && n < 10) {
            return `0${n}`;
        }
        return n;
    }
    return '';
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
    getDateFormatBasedOnLocale,
    parseSimulcast,
    formatNumberTwoDigits
};
