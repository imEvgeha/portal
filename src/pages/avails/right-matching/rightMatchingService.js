import {
    CREATE_NEW_RIGHT_ERROR_MESSAGE,
    SAVE_COMBINED_RIGHT_ERROR_MESSAGE,
} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import {encodedSerialize, prepareSortMatrixParam} from '@vubiquity-nexus/portal-utils/lib/Common';
import {identity, pickBy} from 'lodash';
import {getConfig} from '../../../config';
import {nexusFetch} from '../../../../packages/utils/src/http-client/index';

export const getRightMatchingList = (searchCriteria = {}, page, size, sortedParams) => {
    const queryParams = pickBy(searchCriteria, identity) || {};
    const params = queryParams.status ? {...queryParams, page, size} : {status: 'pending', ...queryParams, page, size};
    const url = `${getConfig('gateway.url')}${getConfig('gateway.service.avails')}/rights${prepareSortMatrixParam(
        sortedParams
    )}`;

    return nexusFetch(url, {params: encodedSerialize(params)});
};

export const getCombinedRight = (rightIds, right) => {
    const url = `${getConfig('gateway.url')}${getConfig(
        'gateway.service.avails'
    )}/rights/match/combined?rightIds=${rightIds}`;
    return nexusFetch(url, {
        method: 'put',
        ...(right && {body: JSON.stringify(right)}),
    });
};

export const putCombinedRight = (rightIds, combinedRight) => {
    const url = `${getConfig('gateway.url')}${getConfig('gateway.service.avails')}/rights/match?rightIds=${rightIds}`;
    const errorToast = {
        description: SAVE_COMBINED_RIGHT_ERROR_MESSAGE,
    };

    return nexusFetch(url, {
        method: 'put',
        body: JSON.stringify(combinedRight),
        errorToast,
    });
};

export const createRightById = id => {
    const url = `${getConfig('gateway.url')}${getConfig('gateway.service.avails')}/rights/${id}/match`;
    const errorCodesToast = [
        {
            status: 400,
        },
    ];
    const errorToast = {
        description: CREATE_NEW_RIGHT_ERROR_MESSAGE,
    };

    return nexusFetch(url, {
        method: 'put',
        errorCodesToast,
        errorToast,
    });
};

export const getMatchingCandidates = (id, tpr = false, rightData) => {
    let query = `?tpr=${tpr}`;
    query += id ? `&rightId=${id}` : '';
    const url = `${getConfig('gateway.url')}${getConfig('gateway.service.avails')}/rights/match/candidates${query}`;
    return nexusFetch(url, {
        method: 'put',
        body: rightData && JSON.stringify(rightData),
    });
};
