import {getConfig} from '../../../../src/config';
import {rightsService} from '../../../../src/pages/legacy/containers/avail/service/RightsService';
import {nexusFetch} from '../http-client';

export const getRightsHistory = rightId => {
    const url = `${getConfig('gateway.eventApiUrl')}${getConfig(
        'gateway.service.eventApiV2'
    )}/search/diff?objectId=${rightId}&eventSource=avails-api`;

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
    const availsClearCache = `${getConfig('gateway.url')}${getConfig('gateway.service.avails')}${getConfig(
        'gateway.service.clearCache'
    )}`;
    const injestClearCache = `${getConfig('gateway.injestUrl')}${getConfig('gateway.service.availsInjest')}${getConfig(
        'gateway.service.clearCache'
    )}`;

    return Promise.allSettled([
        nexusFetch(availsClearCache, {method: 'get'}),
        nexusFetch(injestClearCache, {method: 'get'}),
    ]);
};
