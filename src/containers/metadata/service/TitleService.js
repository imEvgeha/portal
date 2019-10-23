import Http from '../../../util/Http';
import config from 'react-global-configuration';
import {prepareSortMatrixParamTitles} from '../../../util/Common';

const http = Http.create();

export const titleService = {

    freeTextSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = {};
        for (let key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                params[key] = searchCriteria[key];
            }
        }
        return http.get(config.get('gateway.titleUrl') + config.get('gateway.service.title') +'/titles/search' + prepareSortMatrixParamTitles(sortedParams), {params: {...params, page: page, size: pageSize}});
    },
    advancedSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const params = {};
        for (let key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                params[key] = searchCriteria[key];
            }
        }
        return http.get(config.get('gateway.titleUrl') + config.get('gateway.service.title') +'/titles' + prepareSortMatrixParamTitles(sortedParams), {params: {...params, page: page, size: pageSize}});
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

    addTerritoryMetadata: (territoryMetadata) => {
        return http.post(config.get('gateway.titleUrl') + config.get('gateway.service.title') + '/territorymetadata', territoryMetadata);
    },
    getTerritoryMetadataById: (id) => {
        return http.get(config.get('gateway.titleUrl') + config.get('gateway.service.title') + `/territorymetadata?titleId=${id}`);
    },
    updateTerritoryMetadata: (editedTerritoryMetadata) => {
        return http.put(config.get('gateway.titleUrl') + config.get('gateway.service.title') + '/territorymetadata', editedTerritoryMetadata);
    },

    addEditorialMetadata: (editorialMetadata) => {
        return http.post(config.get('gateway.titleUrl') + config.get('gateway.service.title') + '/editorialmetadata', editorialMetadata);
    },
    getEditorialMetadataById: (id) => {
        return http.get(config.get('gateway.titleUrl') + config.get('gateway.service.title') + `/editorialmetadata?titleId=${id}`);
    },
    updateEditorialMetadata: (editedEditorialMetadata) => {
        return http.put(config.get('gateway.titleUrl') + config.get('gateway.service.title') + '/editorialmetadata', editedEditorialMetadata);
    },
    mergeTitles: (query) => {
        return http.post(`${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/titles/legacyTitleMerge?${query}`);
    },
};