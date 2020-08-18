import {identity, pickBy} from 'lodash';
import config from 'react-global-configuration'; // config returns error for gateway
import {CREATE_NEW_RIGHT_ERROR_MESSAGE, SAVE_COMBINED_RIGHT_ERROR_MESSAGE} from '../../../ui/toast/constants';
import {encodedSerialize, prepareSortMatrixParam} from '../../../util/Common';
import {nexusFetch} from '../../../util/http-client/index';

export const getRightMatchingList = (searchCriteria = {}, page, size, sortedParams) => {
    const queryParams = pickBy(searchCriteria, identity) || {};
    const params = queryParams.status ? {...queryParams, page, size} : {status: 'pending', ...queryParams, page, size};
    const url = `${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights${prepareSortMatrixParam(
        sortedParams
    )}`;

    return nexusFetch(url, {params: encodedSerialize(params)});
};

export const getCombinedRight = (rightIds, right) => {
    const url = `${config.get('gateway.url')}${config.get(
        'gateway.service.avails'
    )}/rights/match/combined?rightIds=${rightIds}`;
    return nexusFetch(url, {
        method: 'put',
        ...(right && {body: JSON.stringify(right)}),
    });
};

export const putCombinedRight = (rightIds, combinedRight) => {
    const url = `${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights/match?rightIds=${rightIds}`;
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
    const url = `${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights/${id}/match`;
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

export const getMatchingCandidates = (id, tpr = false, rightData = '') => {
    let query = `?tpr=${tpr}`;
    query += id ? `&rightId=${id}` : '';
    const url = `${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights/match/candidates${query}`;
    return nexusFetch(url, {
        method: 'put',
        body: JSON.stringify(rightData),
    });
};
