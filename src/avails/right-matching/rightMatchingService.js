import config from 'react-global-configuration'; // config returns error for gateway
import pickBy from 'lodash.pickby';
import identity from 'lodash.identity';
import Http from '../../util/Http';
import {prepareSortMatrixParam, encodedSerialize, switchCase, isObject} from '../../util/Common';
import {
    CREATE_NEW_RIGHT_ERROR_MESSAGE, CREATE_NEW_RIGHT_SUCCESS_MESSAGE, SAVE_COMBINED_RIGHT_ERROR_MESSAGE,
} from '../../ui-elements/nexus-toast-notification/constants';
import {store} from '../../index';

const http = Http.create();

export const getRightMatchingList = (searchCriteria = {}, page, size, sortedParams) => {
    const queryParams = pickBy(searchCriteria, identity) || {};
    const params = queryParams.status ? {...queryParams, page, size} : {status: 'pending', ...queryParams, page, size};
    return http.get(
        `${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights${prepareSortMatrixParam(sortedParams)}`,
        {paramsSerializer: encodedSerialize, params}
    );
};

export const getCombinedRight = (rightIds) => {
    return http.get(
        `${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights/match?rightIds=${rightIds}`
    );
};

export const putCombinedRight = (rightIds, combinedRight) => {
    const httpReq = Http.create({
        errorToast: {
            description: SAVE_COMBINED_RIGHT_ERROR_MESSAGE,
        }});
    return httpReq.put(
        `${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights/match?rightIds=${rightIds}`,
        combinedRight
    );
};

export const getRightToMatchList = (searchCriteria = {}, page, size, sortedParams) => {
    const queryParams = pickBy(searchCriteria, identity) || {};
    const params = {...queryParams, page, size};
    return http.get(
        `${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights${prepareSortMatrixParam(sortedParams)}`,
        {paramsSerializer : encodedSerialize, params}
    ).then(response => {
        const {focusedRight} = store.getState().rightMatching;
        const {id} = focusedRight || {};
        // temporary FE handling for operand 'not equal'
        const getUpdatedData = (response, excludedId) => {
            const {data = []} = response || {};
            if (data) {
                if (excludedId) {
                    const result = data.filter(({id}) => id !== excludedId);
                    return result;
                }

                return data;
            }

            return [];
        };
        const updatedData = getUpdatedData(response.data, id);
        const updatedResponse = {
            ...response,
            data: {
                ...response.data,
                data: updatedData,
                total: updatedData.length,
            }
        };

        return updatedResponse;
    });
};

export const getRightMatchingFieldSearchCriteria = (payload) => {
    const {availSource = {}, id} = payload || {};
    const {provider, templateName} = availSource || {};
    const params = {templateName};
    return http.get(
        `${config.get('gateway.availsParserUrl')}${config.get('gateway.service.availsParser')}/providers/${provider}/search-criteria`,
        {paramsSerializer: encodedSerialize, params}
    ).then(({data}) => {
        const {fieldSearchCriteria} = data || {};
        // temporary FE handling for createing query params
        const fieldTypeSearchCriteria = fieldSearchCriteria.filter(({type}) => (!type || type === 'Field'));
        const groupTypeSearchCriteria = fieldSearchCriteria
            .filter(({type, operand, fields}) => type === 'Group' && operand === 'AND' && fields)
            .map(({fields}) => fields)
            .flat();
        const searchCriteria = [...fieldTypeSearchCriteria, ...groupTypeSearchCriteria].filter(Boolean);
        const parseFieldNames = (criteria, name) => {
            const fieldNames = {
                EQ: name,
                SUB: name,
                GTE: `${name}From`,
                GT: `${name}From`,
                LT: `${name}To`,
                LTE: `${name}To`,
            };
            const parsedFieldName = switchCase(fieldNames)(name)(criteria);
            return parsedFieldName;
        };

        const parseFieldValue = (criteria, value, subFieldName) => {
            const subsetValue = Array.isArray(value)
                ? value.map(el => isObject(el) ? el[subFieldName && subFieldName.toLowerCase()] : el).filter(Boolean).join(',')
                : value;
            const fieldValues = {
                EQ: value,
                SUB: subsetValue,
                GTE: value,
                GT: value,
                LT: value,
                LTE: value,
            };
            return switchCase(fieldValues)(value)(criteria);
        };

        const result = searchCriteria.reduce((query, field) => {
            const {fieldName, subFieldName, criteria, targetFieldName} = field;
            const preparedName = `${fieldName.slice(0, 1).toLowerCase()}${fieldName.slice(1)}`;
            const fieldValue = targetFieldName || fieldName;
            const preparedFieldValue = payload[`${fieldValue.slice(0,1).toLowerCase()}${fieldValue.slice(1)}`];
            const key = parseFieldNames(criteria, preparedName);
            query[key] = parseFieldValue(criteria, preparedFieldValue, subFieldName);
            return query;
        }, {});

        return {
            data: {
                fieldSearchCriteria: {
                    id,
                    params: result,
                }
            },
            status: 200,
        };
    })
    .catch(error => {
        throw {error};
    });
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
    return httpReq.put(`${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights/${id}/match/`);
};

