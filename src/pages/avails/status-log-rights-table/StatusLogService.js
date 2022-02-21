import querystring from 'querystring';
import moment from 'moment';
import config from 'react-global-configuration';
import { nexusFetch } from '../../../util/http-client';

const PAGESIZE = 100;

export const getStatusLog = (params, page = 0, size = PAGESIZE) => {
    const queryParams = {page, size};
    const getUpdatedAtParams = () => {
        const updatedAtStart = params?.publishedAt?.publishedAtFrom &&
            moment(params.publishedAt.publishedAtFrom).utc(true).toISOString();
        const updatedAtEnd = params?.publishedAt?.publishedAtTo &&
            moment(params.publishedAt.publishedAtTo).utc(true).toISOString();
            
        if(params?.publishedAt?.publishedAtFrom && params?.publishedAt?.publishedAtTo) {
            return {
                updatedAtStart,
                updatedAtEnd,
            };
        } else if (params?.publishedAt?.publishedAtTo) {
            return {
                updatedAtEnd
            }
        } else if (params?.publishedAt?.publishedAtFrom) {
            return {
                updatedAtStart
            }
        }

        return {};
    }
    const updatedAtParams = getUpdatedAtParams();
    delete params.publishedAt;

    const qs = querystring.stringify({...queryParams, ...updatedAtParams, ...params});
    const url = `${config.get('gateway.titlePlanning')}/publishInfo/search`;

    return nexusFetch(`${url}?${qs}&publisherName=RightPublisherMovidaUK&entityId=rght_McLk8BEXiB`);
};