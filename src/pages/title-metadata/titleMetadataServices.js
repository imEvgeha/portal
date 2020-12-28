import {prepareSortMatrixParamTitles, encodedSerialize} from '@vubiquity-nexus/portal-utils/lib/Common';
import config from 'react-global-configuration';
import {nexusFetch} from '../../util/http-client/index';
import {getSyncQueryParams} from './utils';
import {CONTENT_TYPE} from './constants';

export const getTitleById = id => {
    const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/titles/${id}`;
    return nexusFetch(url);
};

export const getExternalIds = id => {
    const url = `${config.get('gateway.publisher')}${config.get('gateway.service.publisher')}/getPublishInfo/${id}`;
    return nexusFetch(url);
};

export const getTerritoryMetadataById = id => {
    const api = `${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/territorymetadata`;
    const url = `${api}?includeDeleted=false&titleId=${id}`;
    return nexusFetch(url);
};

export const getEditorialMetadataByTitleId = id => {
    const url = `${config.get('gateway.titleUrl')}${config.get(
        'gateway.service.title'
    )}/editorialmetadata?titleId=${id}&includeDeleted=false`;
    return nexusFetch(url);
};

export const updateTitle = (title, syncToVZ, syncToMovida) => {
    const legacySystemNames = getSyncQueryParams(syncToVZ, syncToMovida);
    const params = legacySystemNames ? {legacySystemNames} : {};
    const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/titles/${title.id}`;

    return nexusFetch(url, {
        method: 'put',
        body: JSON.stringify(title),
        params: encodedSerialize(params),
    });
};

export const generateMsvIds = (id, licensor, licensee) => {
    return titleService
        .addMsvAssociationIds(id, licensor, licensee)
        .then(response => response)
        .catch(err => {
            // add toast
        });
};

export const titleService = {
    advancedSearch: (searchCriteria, page, size, sortedParams) => {
        const queryParams = {};
        const filterIsActive = !!Object.keys(searchCriteria).length;
        const partialContentTypeSearch = searchCriteria.contentType
            ? CONTENT_TYPE.find(el => el.toLowerCase().includes(searchCriteria.contentType.toLowerCase()))
            : '';

        // api only supports searching by single contentType value, and it has to be exact match otherwise it throws error
        if (!partialContentTypeSearch) {
            delete searchCriteria.contentType;
        }
        for (const key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                queryParams[key] = key === 'contentType' ? partialContentTypeSearch : searchCriteria[key];
            }
        }
        const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/titles/${
            filterIsActive ? 'search' : ''
        }${prepareSortMatrixParamTitles(sortedParams)}`;

        const params = encodedSerialize({...queryParams, page, size});
        return nexusFetch(url, {params});
    },
    addMsvAssociationIds: (id, licensor, licensee) => {
        const url = `${config.get('gateway.titleUrl')}${config.get(
            'gateway.service.title'
        )}/titles/${id}/msvIds?licensor=${licensor}&licensee=${licensee}`;
        return nexusFetch(url, {
            method: 'post',
        });
    },
    addEditorialMetadata: editorialMetadata => {
        const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.titleV2')}/editorialmetadata`;
        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(editorialMetadata),
        });
    },
    updateEditorialMetadata: editedEditorialMetadata => {
        const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.titleV2')}/editorialmetadata`;
        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(editedEditorialMetadata),
        });
    },
    addTerritoryMetadata: territoryMetadata => {
        const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/territorymetadata`;
        return nexusFetch(url, {
            method: 'post',
            body: JSON.stringify(territoryMetadata),
        });
    },
    updateTerritoryMetadata: editedTerritoryMetadata => {
        const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/territorymetadata`;
        return nexusFetch(url, {
            method: 'put',
            body: JSON.stringify(editedTerritoryMetadata),
        });
    },
};
