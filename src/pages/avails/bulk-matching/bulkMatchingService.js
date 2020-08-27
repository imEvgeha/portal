import config from 'react-global-configuration';
import {nexusFetch} from '../../../util/http-client';
import {rightsService} from '../../legacy/containers/avail/service/RightsService';
import {EXISTING_BONUS_RIGHTS_PAGE_SIZE} from './constants';

export const getAffectedRights = params => {
    const url = `${config.get('gateway.url')}${config.get(
        'gateway.service.avails'
    )}/rights/impacted?rightIds=${params}`;
    return nexusFetch(url);
};

export const getExistingBonusRights = (sourceRightId, coreTitleId = '') => {
    const params = {sourceRightId};
    if (coreTitleId) {
        params.coreTitleId = coreTitleId;
    }
    return rightsService.advancedSearchV2(params, 0, EXISTING_BONUS_RIGHTS_PAGE_SIZE);
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

export const createBonusRights = ({rightIds, coreTitleId = ''}) => {
    const url = `${config.get('gateway.url')}${config.get(
        'gateway.service.avails'
    )}/rights/bonusRights?coreTitleId=${coreTitleId}&rightIds=${rightIds}`;
    return nexusFetch(url, {method: 'POST'});
};