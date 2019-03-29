import Http from '../../../util/Http';
import config from 'react-global-configuration';
import moment from 'moment';
import {momentToISO, prepareSortMatrixParam, safeTrim} from '../../../util/Common';

const http = Http.create();
const httpNoError = Http.create({noDefaultErrorHandling:true});

const isNotEmpty = function(obj){
    if(Array.isArray(obj)){
        return obj.length > 0;
    }
    return obj && safeTrim(obj);
};

const parse = function(value){
    if(typeof  value === 'string')
        return safeTrim(value);

    if(value instanceof moment){
        return momentToISO(value);
    }

    if(Array.isArray(value))
        return value.map(val => parse(val));

    if ('value' in value)
        return parse(value.value);

    return null;
};

const populate = function(key, value, location){
    const dotPos = key.indexOf('.');
    if(dotPos > 0) {
        const firstKey = key.split('.')[0];
        const restKey = key.substring(dotPos+1);
        if(!location[firstKey])
            location[firstKey]={};
        populate(restKey, value, location[firstKey]);
    }else{
        location[key] = parse(value);
    }
};

const prepareRight = function (right) {
    let rightCopy = {};
    Object.keys(right).forEach(key => {
        if(isNotEmpty(right[key])){
            populate(key, right[key], rightCopy);
        }
    });
    return rightCopy;
};

export const rightsService = {

    freeTextSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = {};
        if (searchCriteria.text) {
            params.text = searchCriteria.text;
        }
        return http.get(config.get('gateway.url') + config.get('gateway.service.avails') +'/rights' + prepareSortMatrixParam(sortedParams), {params: {...params, page: page, size: pageSize}});
    },

    advancedSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = {};
        for (let key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                params[key] = searchCriteria[key];
            }
        }
        return http.get(config.get('gateway.url') + config.get('gateway.service.avails') +'/rights' + prepareSortMatrixParam(sortedParams), {params: {...params, page: page, size: pageSize}});
    },

    create: (right) => {
        return http.post(config.get('gateway.url') + config.get('gateway.service.avails') +'/rights', prepareRight(right));
    },

    get: (id) => {
        return httpNoError.get(config.get('gateway.url') + config.get('gateway.service.avails') +'/rights/' + id);
    },

    update: (rightDiff, id) => {
        return http.patch(config.get('gateway.url') + config.get('gateway.service.avails') +`/rights/${id}` + '?updateHistory=true' , prepareRight(rightDiff));
    },
};