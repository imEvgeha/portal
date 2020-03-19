import Http from '../../../util/Http';
import config from 'react-global-configuration';
import moment from 'moment';
import {store} from '../../../index';
import {momentToISO, prepareSortMatrixParam, safeTrim, encodedSerialize} from '../../../util/Common';
import {STRING_TO_ARRAY_OF_STRINGS_HACKED_FIELDS, MULTI_INSTANCE_OBJECTS_IN_ARRAY_HACKED_FIELDS,
    ARRAY_OF_OBJECTS} from './Constants';

const http = Http.create();

const isNotEmpty = function(obj){
    if(Array.isArray(obj)){
        return obj.length > 0;
    }
    return obj && safeTrim(obj);
};

const parse = (value, key) => {
    if(typeof value === 'number' || typeof  value === 'boolean')
        return value;

    if(typeof value === 'string')
        return safeTrim(value);

    if(value instanceof moment){
        return momentToISO(value);
    }

    if(ARRAY_OF_OBJECTS.includes(key)) {
        return value;
    }

    if(Array.isArray(value))
        return value.map(val => parse(val));

    if (value && 'value' in value)
        return parse(value.value);

    return null;
};

const populate = function(key, value, location){
    const dotPos = key.indexOf('.');
    if(dotPos > 0) {
        const firstKey = key.split('.')[0];
        const restKey = key.substring(dotPos+1);
        if(MULTI_INSTANCE_OBJECTS_IN_ARRAY_HACKED_FIELDS.includes(firstKey)) {
            if (!location[firstKey])
                location[firstKey] = [];
            const container = location[firstKey];
            if(value){
                value = parse(value);
                if(typeof  value === 'string') {
                    value = parse(value.split(','));
                }
                for(let i = 0; i < value.length; i++){
                    if(container.length <= i){
                        container.push({[restKey]: value[i]});
                    }else{
                        container[i][restKey] = value[i];
                    }
                }
            }
        }else {
            if (!location[firstKey])
                location[firstKey] = {};
            if(STRING_TO_ARRAY_OF_STRINGS_HACKED_FIELDS.includes(key)){
                value = value.split(',');
            }
            populate(restKey, value, location[firstKey]);
        }
    }else{        
        if(STRING_TO_ARRAY_OF_STRINGS_HACKED_FIELDS.includes(key) && value){
            value = value.split(',');
        }
        location[key] = parse(value, key);
    }
};

const prepareRight = function (right, keepNulls = false) {
    const rightCopy = {};
    Object.keys(right).forEach(key => {
        if(keepNulls || isNotEmpty(right[key])){
            populate(key, right[key], rightCopy);
        }
    });
    return rightCopy;
};

const parseAdvancedFilter = function (searchCriteria) {
    const rootStore = store.getState().root;
    const mappings = rootStore.availsMapping.mappings;
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
            if (value instanceof Object) {
                params = {
                    ...params,
                    ...value
                };
                continue;
            }
            const map = mappings.find(({queryParamName}) => queryParamName === key);
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

export const rightsService = {

    freeTextSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = {};
        if (searchCriteria.text) {
            params.text = searchCriteria.text;
        }
        return http.get(config.get('gateway.url') + config.get('gateway.service.avails') +'/rights' + prepareSortMatrixParam(sortedParams), {paramsSerializer : encodedSerialize, params: {...params, page: page, size: pageSize}});
    },

    advancedSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = parseAdvancedFilter(searchCriteria);
        return http.get(config.get('gateway.url') + config.get('gateway.service.avails') +'/rights' + prepareSortMatrixParam(sortedParams), {paramsSerializer : encodedSerialize, params: {...params, page: page, size: pageSize}});
    },

    create: (right) => {
        return http.post(config.get('gateway.url') + config.get('gateway.service.avails') +'/rights', prepareRight(right));
    },

    get: (id) => {
        const httpNoError = Http.create({defaultErrorHandling: false});
        return httpNoError.get(config.get('gateway.url') + config.get('gateway.service.avails') +'/rights/' + id);
    },

    update: (rightDiff, id) => {
        return http.patch(config.get('gateway.url') + config.get('gateway.service.avails') +`/rights/${id}` + '?updateHistory=true' , prepareRight(rightDiff, true));
    },
};

export {parseAdvancedFilter};
