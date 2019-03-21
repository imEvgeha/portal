import Http from '../../../util/Http';
import config from 'react-global-configuration';
import {prepareSortMatrixParam, safeTrim} from '../../../util/Common';

const http = Http.create();

const isNotEmpty = function(obj){
    if(Array.isArray(obj)){
        return obj.length > 0;
    }
    return obj && safeTrim(obj);
};

const parse = function(value){
    if(typeof  value === 'string')
        return safeTrim(value);

    if(Array.isArray(value))
        return value.map(val => parse(val)).join(',');

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

const prepareAvail = function (avail) {
    let availCopy = {};
    Object.keys(avail).forEach(key => {
        if(isNotEmpty(avail[key])){
            populate(key, avail[key], availCopy);
        }
    });
    return availCopy;
};

export const availService = {

    freeTextSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = {};
        if (searchCriteria.text) {
            params.text = searchCriteria.text;
        }
        return http.get(config.get('gateway.url') + config.get('gateway.service.avails') +'/avails/search' + prepareSortMatrixParam(sortedParams), {params: {...params, page: page, size: pageSize}});
    },

    advancedSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = {};
        for (let key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                params[key] = searchCriteria[key];
            }
        }
        return http.get(config.get('gateway.url') + config.get('gateway.service.avails') +'/avails' + prepareSortMatrixParam(sortedParams), {params: {...params, page: page, size: pageSize}});
    },

    createAvail: (avail) => {
        return http.post(config.get('gateway.url') + config.get('gateway.service.avails') +'/avails', prepareAvail(avail));
    },

    getAvail: (id) => {
        return http.get(config.get('gateway.url') + config.get('gateway.service.avails') +'/avails/' + id);
    },

    updateAvails: (availDiff, id) => {
        return http.patch(config.get('gateway.url') + config.get('gateway.service.avails') +`/avails/${id}` + '?updateHistory=true' , prepareAvail(availDiff));
    },
};