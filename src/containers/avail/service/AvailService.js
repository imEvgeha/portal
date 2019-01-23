import Http from '../../../util/Http';
import config from 'react-global-configuration';
import moment from 'moment';
import {momentToISO, prepareSortMatrixParam} from '../../../util/Common';

const http = Http.create();

const prepareAvail = function (avail) {

    let availCopy = Object.assign({}, avail);
    for(let key in availCopy) {
        if(availCopy.hasOwnProperty(key) && availCopy[key] instanceof moment) {
            availCopy[key] = momentToISO(availCopy[key]);
        }
    }

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

    updateAvails: (avail) => {
        return http.put(config.get('gateway.url') + config.get('gateway.service.avails') +`/avails/${avail.id}`, prepareAvail(avail));
    },
};