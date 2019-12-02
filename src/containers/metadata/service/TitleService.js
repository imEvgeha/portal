import Http from '../../../util/Http';
import config from 'react-global-configuration';
import {getDomainName, prepareSortMatrixParamTitles} from '../../../util/Common';
import {
    TITLE_MATCH_AND_CREATE_ERROR_MESSAGE,
    TITLE_MATCH_AND_CREATE_SUCCESS_MESSAGE
} from '../../../ui-elements/nexus-toast-notification/constants';
import constants from '../../../avails/title-matching/components/create-title-form/CreateTitleFormConstants';

const http = Http.create();

// Building a URL where user can check the newly created title
// (Opens in new tab)
const onViewTitleClick = (response) => {
    const url = `${getDomainName()}/metadata/detail/${response.data.id}`;
    window.open(url, '_blank');
};

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
    createTitleWithoutErrorModal: (title) => {
        const httpNoErrorModal = Http.create({
            defaultErrorHandling: false,
            successToast: {
                description: constants.NEW_TITLE_TOAST_SUCCESS_MESSAGE,
                actions: [{ content: 'View title', onClick: onViewTitleClick }]
            }
        });
        return httpNoErrorModal.post(config.get('gateway.titleUrl') + config.get('gateway.service.title') +'/titles', title);
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
        const httpReq = Http.create({
            errorToast: {
                description: TITLE_MATCH_AND_CREATE_ERROR_MESSAGE,
            },
            successToast: {
                description: TITLE_MATCH_AND_CREATE_SUCCESS_MESSAGE,
                actions: [{content:'View title', onClick: onViewTitleClick}],
            }
        });
        return httpReq.post(`${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/titles/legacyTitleMerge?${query}`);
    },
};