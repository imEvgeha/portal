import config from 'react-global-configuration';
import {nexusFetch} from '../../util/http-client';

const baseUrl = `${config.get('gateway.url')}${config.get('gateway.service.avails')}`;

export const getAffectedRights = params => {
    const url = `${baseUrl}/rights/impacted?rightIds=${params}`;
    return nexusFetch(url);
};
export const getExistingBonusRights = params => {
    // TODO: change the API to correct path
    const url = `${baseUrl}/rights/impacted?rightIds=${params}`;
    return nexusFetch(url);
};

export const getRestrictedTitles = params => {
    const url = `${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights/restrictedCoreTitleIds?rightIds=${params}`;
    return nexusFetch(url);
};

// Sets Core title ID of each listed right to a given coreTitleId (bulk match)
// If coreTitleId is omitted, it will remove coreTitleId for each right (bulk unmatch)
export const setCoreTitleId = ({rightIds, coreTitleId = ''}) => {
    const url = `${baseUrl}/rights/coreTitleId?coreTitleId=${coreTitleId}&rightIds=${rightIds}`;
    return nexusFetch(url, {method: 'PATCH'});
};
