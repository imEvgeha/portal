import config from 'react-global-configuration';
import {nexusFetch} from '../../util/http-client';

export const getAffectedRights = params => {
    const url = `${config.get('gateway.url')}${config.get(
        'gateway.service.avails'
    )}/rights/impacted?rightIds=${params}`;
    return nexusFetch(url);
};
export const getExistingBonusRights = params => {
    // TODO: change the API to correct path
    const url = `${config.get('gateway.url')}${config.get(
        'gateway.service.avails'
    )}/rights/impacted?rightIds=${params}`;
    return nexusFetch(url);
};

export const getRestrictedTitles = params => {
    const url = `${config.get('gateway.url')}${config.get(
        'gateway.service.avails'
    )}/rights/restrictedCoreTitleIds?rightIds=${params}`;
    return nexusFetch(url);
};

// Sets Core title ID of each listed right to a given coreTitleId (bulk match)
// If coreTitleId is omitted, it will remove coreTitleId for each right (bulk unmatch)
export const setCoreTitleId = ({rightIds, coreTitleId = ''}) => {
    const url = `${config.get('gateway.url')}${config.get(
        'gateway.service.avails'
    )}/rights/coreTitleId?coreTitleId=${coreTitleId}&rightIds=${rightIds}`;
    return nexusFetch(url, {method: 'PATCH'});
};

export const getRightsHistory = searchIds => {
    const url = `${config.get('gateway.eventApiUrl')}${config.get('gateway.service.eventApi')}/history/bulkRequest`;
    const body = {
        excludes: ['header'],
        searchIdType: 'CORRELATION_ID',
        searchIds,
    };

    return nexusFetch(url, {
        method: 'post',
        body: JSON.stringify(body),
    });
};

export const createBonusRights = ({rightIds, coreTitleId = ''}) => {
    const url = `${config.get('gateway.url')}${config.get(
        'gateway.service.avails'
    )}/rights/bonusRights?coreTitleId=${coreTitleId}&rightIds=${rightIds}`;
    return nexusFetch(url, {method: 'POST'});
};
