import config from 'react-global-configuration'; // config returns error for gateway
import pickBy from 'lodash.pickby';
import identity from 'lodash.identity';
import Http from '../../util/Http';
import {prepareSortMatrixParam, encodedSerialize} from '../../util/Common';
import {
    CREATE_NEW_RIGHT_ERROR_MESSAGE, CREATE_NEW_RIGHT_SUCCESS_MESSAGE,
    SAVE_COMBINED_RIGHT_ERROR_MESSAGE, SAVE_COMBINED_RIGHT_SUCCESS_MESSAGE,
} from '../../ui-elements/nexus-toast-notification/constants';

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
    const httpReq = Http.create({
        errorToast: {
            description: SAVE_COMBINED_RIGHT_ERROR_MESSAGE,
        },
        successToast: {
            description: SAVE_COMBINED_RIGHT_SUCCESS_MESSAGE,
        }});
    return httpReq.put(
        `${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights/match/?rightIds=${rightIds}`,
        combinedRight
    );
};

export const getRightToMatchList = (page, size, searchCriteria = {}, sortedParams) => {
    const {excludedItems} = searchCriteria;
    const prop = 'excludedItems';
    const filteredSearchCriteria = Object.keys(searchCriteria)
        .reduce((object, key) => {
            if (key !== prop) {
                object[key] = searchCriteria[key];
            }
            return object;
        }, {});
    const queryParams = pickBy(filteredSearchCriteria, identity) || {};
    const params = {...queryParams, page, size};
    return http.get(
        `${config.get('gateway.url')}${config.get('gateway.service.avails')}/${endpoint}${prepareSortMatrixParam(sortedParams)}`, 
        {paramsSerializer : encodedSerialize, params}
    ).then(response => {
        // temporal FE handling of not equal query params
        const updatedResponse = {
            ...response,
            data: {
                ...response.data,
                data: response.data.data.filter(el => Array.isArray(excludedItems) && excludedItems.every(item => item.id !== el.id)),
                total: response.data.total - excludedItems.length,
            }
        };
        return updatedResponse;
    });
};

export const getRightMatchingFieldSearchCriteria = (provider, templateName) => {
    const params = {templateName};
    return http.get(
        `${config.get('gateway.availsParserUrl')}${config.get('gateway.service.availsParser')}/providers/${provider}/search-criteria`,
        {paramsSerializer: encodedSerialize, params}
    );
};


export const createRightById = (id) => {
    const httpReq = Http.create({
        errorCodesToast: [{
            status: 400,
        }],
        errorToast: {
            description: CREATE_NEW_RIGHT_ERROR_MESSAGE,
        },
        successToast: {
            description: CREATE_NEW_RIGHT_SUCCESS_MESSAGE,
        }
    });
    return httpReq.put(`${config.get('gateway.url')}${config.get('gateway.service.avails')}/${endpoint}/${id}/match/`);
};

