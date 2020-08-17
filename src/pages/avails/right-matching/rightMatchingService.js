import {identity, pickBy} from 'lodash';
import config from 'react-global-configuration'; // config returns error for gateway
import {store} from '../../../index';
import {CREATE_NEW_RIGHT_ERROR_MESSAGE, SAVE_COMBINED_RIGHT_ERROR_MESSAGE} from '../../../ui/toast/constants';
import {encodedSerialize, isObject, prepareSortMatrixParam, switchCase} from '../../../util/Common';
import {nexusFetch} from '../../../util/http-client/index';
import {setFoundFocusRightInRightsRepository} from './rightMatchingActions';

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

export const getRightToMatchList = (searchCriteria = {}, page, size, sortedParams) => {
    const queryParams = pickBy(searchCriteria, identity) || {};
    const params = {...queryParams, page, size};
    const url = `${config.get('gateway.url')}${config.get('gateway.service.avails')}/rights${prepareSortMatrixParam(
        sortedParams
    )}`;

    return nexusFetch(url, {
        params: encodedSerialize(params),
    }).then(response => {
        const {rightMatching} = store.getState().avails || {};
        const {focusedRight} = rightMatching || {};
        const {id} = focusedRight || {};
        // temporary FE handling for operand 'not equal'
        const getUpdatedData = (response, excludedId) => {
            const {data = []} = response || {};
            if (data && data.find(({id}) => id === excludedId)) {
                store.dispatch(setFoundFocusRightInRightsRepository({foundFocusRightInRightsRepository: true}));
                return data.filter(({id}) => id !== excludedId);
            }
            return data;
        };
        const updatedData = getUpdatedData(response, id);

        const {foundFocusRightInRightsRepository} = store.getState().avails.rightMatching;
        return {
            ...response,
            data: updatedData,
            total: foundFocusRightInRightsRepository ? response.total - 1 : response.total,
        };
    });
};

export const getRightMatchingFieldSearchCriteria = payload => {
    const {availSource = {}, id} = payload || {};
    const {provider, templateName} = availSource || {};
    const params = {templateName};
    const url = `${config.get('gateway.availsParserUrl')}${config.get(
        'gateway.service.availsParser'
    )}/providers/${provider}/search-criteria`;
    return nexusFetch(url, {params: encodedSerialize(params)})
        .then(data => {
            const {fieldSearchCriteria} = data || {};
            // temporary FE handling for createing query params
            const fieldTypeSearchCriteria = fieldSearchCriteria.filter(({type}) => !type || type === 'Field');
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
                return switchCase(fieldNames)(name)(criteria);
            };

            const parseFieldValue = (criteria, value, subFieldName) => {
                const subsetValue = Array.isArray(value)
                    ? value
                          .map(el => (isObject(el) ? el[subFieldName && subFieldName.toLowerCase()] : el))
                          .filter(Boolean)
                          .join(',')
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

            // This was added to exclude custom filters which were causing issues with ag-grid
            // Check http://agile.vubiquity.com/browse/PORT-2530
            const criteriaToBeApplied = [
                'Title',
                'ContentType',
                'Licensor',
                'Licensee',
                'LicenseType',
                'PlatformCategory',
                'ReleaseYear',
                'LicenseRightsDescription',
            ];
            const result = searchCriteria
                .filter(({fieldName}) => criteriaToBeApplied.includes(fieldName))
                .reduce((query, field) => {
                    const {targetFieldName, fieldName, subFieldName, criteria} = field;
                    const preparedName = `${fieldName.slice(0, 1).toLowerCase()}${fieldName.slice(1)}`;
                    const fieldValue = targetFieldName || fieldName;
                    const preparedFieldValue = payload[`${fieldValue.slice(0, 1).toLowerCase()}${fieldValue.slice(1)}`];
                    const key = parseFieldNames(criteria, preparedName);
                    query[key] = parseFieldValue(criteria, preparedFieldValue, subFieldName);

                    return query;
                }, {});

            return {
                fieldSearchCriteria: {
                    id,
                    params: result,
                },
            };
        })
        .catch(error => {
            throw new Error(error);
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
