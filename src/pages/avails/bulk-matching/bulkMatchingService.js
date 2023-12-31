import {getApiURI} from '@vubiquity-nexus/portal-utils/lib/config';
import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {rightsService} from '../../legacy/containers/avail/service/RightsService';
import {EXISTING_BONUS_RIGHTS_PAGE_SIZE} from './constants';

export const getAffectedRights = params => {
    const uri = `/rights/impacted?rightIds=${params}`;
    const url = getApiURI('avails', uri);

    return nexusFetch(url);
};

export const getExistingBonusRights = (sourceRightIdList, coreTitleId = '') => {
    const params = {sourceRightIdList};
    if (coreTitleId) {
        params.coreTitleId = coreTitleId;
    }
    return rightsService.advancedSearchV2({}, 0, EXISTING_BONUS_RIGHTS_PAGE_SIZE, {}, params);
};

export const getRestrictedTitles = params => {
    const uri = `/rights/restrictedCoreTitleIds`;
    const url = getApiURI('avails', uri);

    const body = {
        impactedRightIds: [...params],
    };
    return nexusFetch(url, {method: 'post', body: JSON.stringify(body)});
};
// Sets Core title ID of each listed right to a given coreTitleId (bulk match)
// If coreTitleId is omitted, it will remove coreTitleId for each right (bulk unmatch)
export const setCoreTitleId = ({rightIds, coreTitleId = ''}) => {
    const uri = `/rights/coreTitleId?coreTitleId=${coreTitleId}`;
    const url = getApiURI('avails', uri);

    const body = {
        impactedRightIds: [...rightIds],
    };
    return nexusFetch(url, {method: 'PATCH', body: JSON.stringify(body)});
};

export const createBonusRights = ({rightIds, coreTitleId = ''}) => {
    const uri = `/rights/bonusRights?coreTitleId=${coreTitleId}&rightIds=${rightIds}`;
    const url = getApiURI('avails', uri);

    return nexusFetch(url, {method: 'POST'});
};
