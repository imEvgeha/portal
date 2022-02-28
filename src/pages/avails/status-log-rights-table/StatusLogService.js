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
            params?.publishedAt?.publishedAtFrom && moment(params.publishedAt.publishedAtFrom).utc(true).toISOString();
        const updatedAtEnd =
            params?.publishedAt?.publishedAtTo && moment(params.publishedAt.publishedAtTo).utc(true).toISOString();

        if (params?.publishedAt?.publishedAtFrom && params?.publishedAt?.publishedAtTo) {
            return {
                updatedAtStart,
                updatedAtEnd,
            };
        } else if (params?.publishedAt?.publishedAtTo) {
            return {
                updatedAtEnd,
            };
        } else if (params?.publishedAt?.publishedAtFrom) {
            return {
                updatedAtStart,
            };
        }

        return {};
    };
    const updatedAtParams = getUpdatedAtParams();
    delete params.publishedAt;

    const qs = querystring.stringify({...queryParams, ...updatedAtParams, ...params});
    const url = `${getConfig('gateway.titlePlanning')}${getConfig('gateway.service.titlePlanning')}/publishInfo/search`;
    const response = nexusFetch(`${url}?${qs}&publisherName=RightPublisherMovidaUK`);
    response.then(data => {
        store.dispatch(saveStatusDataAction(data));
    });

    return response;
};

export const postReSync = data => {
    const url = `${getConfig('gateway.titleResync')}`;
    const response = nexusFetch(url, {method: 'post', body: JSON.stringify(data)});
    return response;
};
