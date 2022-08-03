import {rightsService} from '../../../../src/pages/legacy/containers/avail/service/RightsService';
import {getApiURI} from '../config';
import {nexusFetch} from '../http-client';

export const getRightsHistory = rightId => {
    const uri = `/search/diff?objectId=${rightId}&eventSource=avails-api`;
    const url = getApiURI('event', uri);

    return nexusFetch(url, {
        method: 'get',
    });
};

export const getLinkedToOriginalRights = (params, pageSize) => {
    return rightsService.advancedSearchV2({}, 0, pageSize, {}, params);
};

export const bulkDeleteRights = (selectedRightIds, impactedRightIds = []) => {
    return rightsService.delete(selectedRightIds, impactedRightIds);
};

export const getLinkedToOriginalRightsV2 = selectedRightIds => {
    return rightsService.findBonusAndTPRsToBeDeleted(selectedRightIds);
};

export const reloadConfigurationService = () => {
    const cacheClearURI = `/cache/clear`;
    const availsClearCache = getApiURI('avails', cacheClearURI);
    const injestClearCache = getApiURI('availsIngest', cacheClearURI);

    return Promise.allSettled([
        nexusFetch(availsClearCache, {method: 'get'}),
        nexusFetch(injestClearCache, {method: 'get'}),
    ]);
};
