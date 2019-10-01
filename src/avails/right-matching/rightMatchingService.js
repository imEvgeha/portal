import config from 'react-global-configuration'; // config returns error for gateway
import Http from '../../util/Http';
import {prepareSortMatrixParam, encodedSerialize} from '../../util/Common'; 

const endpoint = 'rights';
const http = Http.create();

export const getRightMatchingList = (page, size, sortedParams) => {
    const params = {
        status: 'pending',
        page, 
        size,
    };
    return http.get(
        `${config.get('gateway.url')}${config.get('gateway.service.avails')}/${endpoint}${prepareSortMatrixParam(sortedParams)}`, 
        {paramsSerializer : encodedSerialize, params}
    ); 
};
