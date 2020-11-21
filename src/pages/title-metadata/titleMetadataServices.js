import config from 'react-global-configuration';
import {prepareSortMatrixParamTitles, encodedSerialize} from '../../util/Common';
import {nexusFetch} from '../../util/http-client/index';
import {getSyncQueryParams} from './utils';

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

export const titleService = {
    advancedSearch: (searchCriteria, page, size, sortedParams) => {
        const queryParams = {};
        const filterIsActive = !!Object.keys(searchCriteria).length;
        for (const key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                queryParams[key] = searchCriteria[key];
            }
        }
        const url = `${config.get('gateway.titleUrl')}${config.get('gateway.service.title')}/titles/${
            filterIsActive ? 'search' : ''
        }${prepareSortMatrixParamTitles(sortedParams)}`;
        const params = encodedSerialize({...queryParams, page, size});
        return nexusFetch(url, {params});
    },
};
