import querystring from 'querystring';
import config from 'react-global-configuration';
import { nexusFetch } from '../../../util/http-client';

const PAGESIZE = 100;

export const getStatusLog = (params, page = 0, size = PAGESIZE) => {
    const queryParams = {page, size};
    const getUpdatedAtParams = () => {
        if(params?.publishedAt?.publishedAtFrom && params?.publishedAt?.publishedAtTo) {
            return {
                updatedAtStart: params.publishedAt.publishedAtFrom,
                updatedAtEnd: params.publishedAt.publishedAtTo,
            };
        } else if (params?.publishedAt?.publishedAtTo) {
            return {
                updatedAtEnd: params.publishedAt.publishedAtTo,
            }
        } else if (params?.publishedAt?.publishedAtFrom) {
            return {
                updatedAtStart: params.publishedAt.publishedAtFrom
            }
        }

        return {};
    }
    const updatedAtParams = getUpdatedAtParams();
    delete params.publishedAt;

    const qs = querystring.stringify({...queryParams, ...updatedAtParams, ...params});
    const url = `${config.get('gateway.kongUrl')}${config.get('gateway.service.titlePlanning')}/publishInfo/search`;

    return nexusFetch(`${url}?${qs}&publisherName=RightPublisherMovidaUK?`);
};