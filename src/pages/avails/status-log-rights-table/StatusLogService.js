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
        const updatedAtStart =
            params?.updatedAt?.updatedAtFrom && moment(params.updatedAt.updatedAtFrom).utc(true).toISOString();
        const updatedAtEnd =
            params?.updatedAt?.updatedAtTo && moment(params.updatedAt.updatedAtTo).utc(true).endOf('day').toISOString();

        if (params?.updatedAt?.updatedAtFrom && params?.updatedAt?.updatedAtTo) {
            return {
                updatedAtStart,
                updatedAtEnd,
            };
        } else if (params?.updatedAt?.updatedAtTo) {
            return {
                updatedAtEnd,
            };
        } else if (params?.updatedAt?.updatedAtFrom) {
            return {
                updatedAtStart,
            };
        }

        return {};
    };
    const updatedAtParams = getUpdatedAtParams();
    delete params.updatedAt;

    const qs = querystring.stringify({...queryParams, ...updatedAtParams, ...params});
    const url = `${getConfig('gateway.titlePlanning')}${getConfig('gateway.service.titlePlanning')}/publishInfo/search`;
    const response = nexusFetch(`${url}?${qs}&publisherName=RightPublisherMovidaUK`);
    response.then(data => {
        store.dispatch(saveStatusDataAction(data));
    });

    return response;
};

export const postReSync = data => {
    const url = `${getConfig('gateway.titlePlanning')}${getConfig('gateway.service.titlePlanning')}/rights/sync`;
    const response = nexusFetch(url, {method: 'post', body: JSON.stringify(data)});
    return response;
};
