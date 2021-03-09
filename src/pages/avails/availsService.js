import config from 'react-global-configuration';
import {nexusFetch} from '../../util/http-client';
import {rightsService} from '../legacy/containers/avail/service/RightsService';

export const getRightsHistory = rightId => {
    const url = `${config.get('gateway.eventApiUrl')}${config.get(
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
