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

export const getCombinedRight = (rightIds) => {
    return http.get(
        `${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights/match/?rightIds=${rightIds}`
    );
};

export const putCombinedRight = (rightIds, combinedRight) => {
    return http.put(
        `${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights/match/?rightIds=${rightIds}`,
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
    const params = {templateName};
    return http.get(
        `${config.get('gateway.availsParserUrl')}${config.get('gateway.service.availsParser')}/providers/${provider}/search-criteria`,
        {paramsSerializer: encodedSerialize, params}
    );
};


export const createRightById = (id) => {
    return http.put(`${config.get('gateway.url')}${config.get('gateway.service.avails')}/${endpoint}/${id}/match/`); 
};

