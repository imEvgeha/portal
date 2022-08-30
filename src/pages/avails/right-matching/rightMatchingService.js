import {
    CREATE_NEW_RIGHT_ERROR_MESSAGE,
    SAVE_COMBINED_RIGHT_ERROR_MESSAGE,
} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import {encodedSerialize, prepareSortMatrixParam} from '@vubiquity-nexus/portal-utils/lib/Common';
import {getApiURI} from '@vubiquity-nexus/portal-utils/lib/config';
import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {identity, pickBy} from 'lodash';

export const getRightMatchingList = (searchCriteria = {}, page, size, sortedParams) => {
    const queryParams = pickBy(searchCriteria, identity) || {};
    const params = queryParams.status ? {...queryParams, page, size} : {status: 'pending', ...queryParams, page, size};

    const uri = `/rights${prepareSortMatrixParam(sortedParams)}`;
    const url = getApiURI('avails', uri);

    return nexusFetch(url, {params: encodedSerialize(params)});
};

export const getCombinedRight = (rightIds, right) => {
    const uri = `/rights/match/combined?rightIds=${rightIds}`;
    const url = getApiURI('avails', uri);

    return nexusFetch(url, {
        method: 'put',
        ...(right && {body: JSON.stringify(right)}),
    });
};

export const putCombinedRight = (rightIds, combinedRight) => {
    const uri = `/rights/match?rightIds=${rightIds}`;
    const url = getApiURI('avails', uri);

    const customErrors = [
        {
            errorCodes: 'all',
            message: SAVE_COMBINED_RIGHT_ERROR_MESSAGE,
        },
    ];

    return nexusFetch(url, {
        method: 'put',
        body: JSON.stringify(combinedRight),
        customErrors,
    });
};

export const createRightById = id => {
    const uri = `/rights/${id}/match`;
    const url = getApiURI('avails', uri);

    const customErrors = [
        {
            errorCodes: [400],
            message: CREATE_NEW_RIGHT_ERROR_MESSAGE,
        },
    ];

    return nexusFetch(url, {
        method: 'put',
        customErrors,
    });
};

export const getMatchingCandidates = (id, tpr = false, rightData) => {
    const query = `?tpr=${tpr}${id ? `&rightId=${id}` : ''}`;
    const uri = `/rights/match/candidates${query}`;
    const url = getApiURI('avails', uri);

    return nexusFetch(url, {
        method: 'put',
        body: rightData && JSON.stringify(rightData),
    });
};
