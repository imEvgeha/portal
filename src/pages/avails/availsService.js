import config from 'react-global-configuration';
import {nexusFetch} from '../../util/http-client';

export const getAffectedRights = params => {
    const url = `${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights/impacted?rightIds=${params}`;
    return nexusFetch(url);
};

export const getRestrictedTitles = params => {
    const url = `${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights/restrictedCoreTitleIds?rightIds=${params}`;
    return nexusFetch(url);
};

export const setCoreTitleId = ({rightIds, coreTitleId}) => {
    const url = `${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights/coreTitleId?coreTitleId=${coreTitleId}&rightIds=${rightIds}`;
    return nexusFetch(url, {
        method: 'PATCH',
    });
};
