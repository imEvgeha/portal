import config from 'react-global-configuration';
import {nexusFetch} from '../../util/http-client/index';

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
