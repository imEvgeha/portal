import {isEmpty, isObject} from 'lodash';
import {nexusFetch} from '../../util/http-client';
import config from 'react-global-configuration';

const BASE_PARAM_NAME = 'event.messageHeader.';

export const getEventSearch = (params, page = 0, pageSize = 100, sortedParams) => {
    let paramString = '';

    // Build sortParams string if sortParams are provided
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
            // If we have a complex filter, break it down
            if (isObject(params[paramKey])) {
                const complexFilter = params[paramKey];

                // Converts '-From' and '-To' suffixes to '-Start' and '-End' respectively
                // and packs them into a param string
                paramString = Object.keys(complexFilter).reduce((paramString, key) => {
                    if (complexFilter[key]) {
                        let filterParamKey = key;

                        if (key.endsWith('From')) {
                            filterParamKey = `${key.slice(0, -4)}Start`;
                        } else if (key.endsWith('To')) {
                            filterParamKey = `${key.slice(0, -2)}End`;
                        }

                        return `${paramString}&${BASE_PARAM_NAME}${filterParamKey}=${complexFilter[key]}`;
                    }
                }, paramString);

                return paramString;
            }

            return `${paramString}&${BASE_PARAM_NAME}${paramKey}=${params[paramKey]}`;
        }, paramString);
    }
    
    const url = './src/pages/event-management/eventManagementMockData.json';
    
    return nexusFetch(`${url}${paramString}`, {method: 'get'});
};

export const replayEvent = ({eventId}) => {
    const url = `${config.get('gateway.eventApiUrl')}${config.get('gateway.service.eventApi')}/admin/replay/${eventId}`;
    return nexusFetch(url, {
        method: 'post'
    });
};
