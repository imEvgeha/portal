import querystring from 'querystring';
import moment from 'moment';
import {getConfig} from '../../../config';
import {store} from '../../../index';
import {nexusFetch} from '../../../util/http-client';
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
    delete params.updatedAt;

    const qs = querystring.stringify({...queryParams, ...getUpdatedAtParams(), ...params});
    const url = `${getConfig('gateway.titlePlanning')}${getConfig('gateway.service.titlePlanning')}/publishInfo/search`;
    const response = nexusFetch(`${url}?${qs}&publisherName=RightPublisherMovidaUK`);
    response.then(data => store.dispatch(saveStatusDataAction(data)));
    return response;
};

export const postReSync = data => {
    const url = `${getConfig('gateway.titlePlanning')}${getConfig('gateway.service.titlePlanning')}/rights/sync`;
    return nexusFetch(url, {method: 'post', body: JSON.stringify(data)});
};
