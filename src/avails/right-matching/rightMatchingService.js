import config from 'react-global-configuration'; // config returns error for gateway
import Http from '../../util/Http';
import {prepareSortMatrixParam, encodedSerialize} from '../../util/Common'; 

const gateway = {
    url:'https://availsapi.dev.vubiquity.com',
    titleUrl:'https://titlesapi.dev.vubiquity.com',
    configuration: 'https://configapi.dev.vubiquity.com',
    assetManagementURL: 'https://asset-management-api.dev.vubiquity.com',
    service: {
        avails: '/avails-api/v1',
        title: '/titles-api/v1',
        configuration: '/configuration-api/v1',
        assetManagement: '/api/asset-management/v1'
    }
};

const url = `${gateway.url}${gateway.service.avails}`;
const endpoint = 'rights';
const http = Http.create();

export const getRightMatchingList = (page, size, sortedParams) => {
    const params = {
        status: 'pending',
        page, 
        size,
    };
    return http.get(
        `${url}/${endpoint}${prepareSortMatrixParam(sortedParams)}`, 
        {paramsSerializer : encodedSerialize, params}
    ); 
};
