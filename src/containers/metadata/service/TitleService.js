import Http from '../../../util/Http';
import config from 'react-global-configuration';
import {prepareSortMatrixParam} from '../../../util/Common';

const http = Http.create();

export const titleService = {

    freeTextSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = {};
        if (searchCriteria.text) {
            params.text = searchCriteria.text;
        }
        return http.get(config.get('gateway.titleUrl') + config.get('gateway.service.title') +'/titles' + prepareSortMatrixParam(sortedParams), {params: {...params, page: page, size: pageSize}});
    },

    advancedSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = {};
        for (let key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                params[key] = searchCriteria[key];
            }
        }
        return http.get(config.get('gateway.titleUrl') + config.get('gateway.service.title') +'/titles' + prepareSortMatrixParam(sortedParams), {params: {...params, page: page, size: pageSize}});
    },

    createTitle: (title) => {
        return http.post(config.get('gateway.titleUrl') + config.get('gateway.service.title') +'/titles', title);
    },

    updateTitle: (title) => {
        return http.put(config.get('gateway.titleUrl') + config.get('gateway.service.title') +`/titles/${title.id}`, title);
    },
    getTitleById: (id) => {
        return http.get(config.get('gateway.titleUrl') + config.get('gateway.service.title') + `/titles/${id}`);
    },
    addMetadata: (territoryMetadata) => {
        return http.post(config.get('gateway.titleUrl') + config.get('gateway.service.title') + '/territorymetadata', territoryMetadata);
    }
};