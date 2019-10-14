import config from 'react-global-configuration'; // config returns error for gateway
import pickBy from 'lodash.pickby';
import identity from 'lodash.identity';
import Http from '../../util/Http';
import {prepareSortMatrixParam, encodedSerialize} from '../../util/Common';

const endpoint = 'rights';
const http = Http.create();

export const getRightMatchingList = (page, size, searchCriteria = {}, sortedParams) => {
    const queryParams = pickBy(searchCriteria, identity) || {};
    const params = queryParams.status ? {...queryParams, page, size} : {status: 'pending', ...queryParams, page, size};
    return http.get(
        `${config.get('gateway.url')}${config.get('gateway.service.avails')}/${endpoint}${prepareSortMatrixParam(sortedParams)}`,
        {paramsSerializer: encodedSerialize, params}
    );
};

export const getCombinedRight = (rightId, matchedRightId) => {
    return http.get(
        `${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights/${rightId}/match/${matchedRightId}`
    );
};

export const putCombinedRight = (rightId, matchedRightId, combinedRight) => {
    return http.get(
        `${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights/${rightId}/match/${matchedRightId}`,
        combinedRight
    );
};

export const getRightToMatchList = (page, size, searchCriteria = {}, sortedParams) => {
    const queryParams = pickBy(searchCriteria, identity) || {};
    const params = {...queryParams, page, size};
    return http.get(
        `${config.get('gateway.url')}${config.get('gateway.service.avails')}/${endpoint}${prepareSortMatrixParam(sortedParams)}`, 
        {paramsSerializer : encodedSerialize, params}
    ); 
};

export const getRightMatchingFieldSearchCriteria = (provider, templateName) => {
    return http.get(
        `${config.get('gateway.availsParserUrl')}${config.get('gateway.service.availsParser')}/providers/${provider}/search-criteria/templateName=${templateName}`
    );
};

