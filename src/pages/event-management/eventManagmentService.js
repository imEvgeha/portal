import Http from '../../util/Http';
import {isEmpty, isObject} from 'lodash';
const BASE_PARAM_NAME = 'event.messageHeader.';

const http = Http.create();

export const getEventSearch = (params, page = 0, pageSize = 100, sortedParams) => {
    let paramString = '';

    // Build sortParams string if sortparams are provided
    if (!isEmpty(sortedParams)) {
        paramString = sortedParams.reduce((sortedParams, {colId, sort}) => (
            `${sortedParams}${colId}=${sort}`
        ), ';');
    }

    // Spice it up with some page and pageSize stuff
    paramString = `${paramString}?page=${page}&size=${pageSize}`;

    // Build param string if params are provided
    if (!isEmpty(params)) {
        paramString = Object.keys(params).reduce((paramString, paramKey) => {

            // Converts '-From' and '-To' suffixes to '-Start' and '-End' respectively
            // and packs them into a param string
            if (isObject(params[paramKey])) {
                const {
                    createdTimeStampFrom,
                    createdTimeStampTo,
                    postedTimeStampFrom,
                    postedTimeStampTo
                } = params[paramKey];

                const createdTimeStampStart = createdTimeStampFrom
                    ? `${BASE_PARAM_NAME}createdTimeStampStart=${createdTimeStampFrom}`
                    : '';
                const createdTimeStampEnd = createdTimeStampTo
                    ? `${BASE_PARAM_NAME}createdTimeStampEnd=${createdTimeStampTo}`
                    : '';

                const postedTimeStampStart = postedTimeStampFrom
                    ? `${BASE_PARAM_NAME}postedTimeStampStart=${postedTimeStampFrom}`
                    : '';
                const postedTimeStampEnd = postedTimeStampTo
                    ? `${BASE_PARAM_NAME}postedTimeStampEnd=${postedTimeStampTo}`
                    : '';

                const createdTimeStampParam = (createdTimeStampStart && createdTimeStampEnd)
                    ? `${createdTimeStampStart}&${createdTimeStampEnd}`
                    : `${createdTimeStampStart || createdTimeStampEnd || ''}`;

                const postedTimeStampParam = (postedTimeStampStart && postedTimeStampEnd)
                    ? `${postedTimeStampStart}&${postedTimeStampEnd}`
                    : `${postedTimeStampStart || postedTimeStampEnd || ''}`;

                const paramValue = createdTimeStampParam || postedTimeStampParam;
                return `${paramString}&${paramValue}`;
            }

            return `${paramString}&${BASE_PARAM_NAME}${paramKey}=${params[paramKey]}`;
        }, paramString);
    }
    
    const url = './src/pages/event-management/eventManagementMockData.json';
    
    return http.get(`${url}${paramString}`);
};
