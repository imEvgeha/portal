import querystring from 'querystring';
import {getApiURI} from '@vubiquity-nexus/portal-utils/lib/config';
import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import moment from 'moment';
import {store} from '../../../index';
import columnMappings from './columnMappings';
import {saveStatusDataAction} from './statusLogActions';

const PAGESIZE = 100;

export const getStatusLog = (params, page = 0, size = PAGESIZE) => {
    const queryParams = {page, size};
    const getUpdatedAtParams = () => {
        const updatedAtFrom = params?.updatedAt?.updatedAtFrom;
        const updatedAtStart = updatedAtFrom && moment(updatedAtFrom).utc(true).toISOString();

        const updatedAtTo = params?.updatedAt?.updatedAtTo;
        const updatedAtEnd = updatedAtTo && moment(updatedAtTo).utc(true).endOf('day').toISOString();

        return {
            ...(updatedAtStart && {updatedAtStart}),
            ...(updatedAtEnd && {updatedAtEnd}),
        };
    };
    const updatedAtParams = getUpdatedAtParams();
    delete params.updatedAt;

    columnMappings
        .filter(item => item.searchDataType === 'multiselect')
        .forEach(map => {
            const key = map.javaVariableName;
            params[`${key}List`] = params[key];
            delete params[key];
        });

    const qs = querystring.stringify({...queryParams, ...updatedAtParams, ...params});

    const uri = `/publishInfo/search?${qs}&publisherName=RightPublisherMovidaUK`;
    const url = getApiURI('titlePlanning', uri);
    const response = nexusFetch(url);
    response.then(data => store.dispatch(saveStatusDataAction(data)));
    return response;
};

export const postReSync = data => {
    const uri = `/rights/sync`;
    const url = getApiURI('titlePlanning', uri);
    return nexusFetch(url, {method: 'post', body: JSON.stringify(data)});
};
