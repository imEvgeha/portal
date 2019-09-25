import config from 'react-global-configuration';
import Http from '../../util/Http';
import {prepareSortMatrixParam, encodedSerialize} from '../../../util/Common'; 

const url = `${config.get('gateway.url')}${config.get('gateway.service.avails')}`;
const endpoint = 'rights';
const http = Http.create();

export const getRightMatchingList = (page, size, sortedParams) => {
    const params = {
        status: 'pending',
        page, 
        size,
    };
    return http.get(`${url}/${endpoint}${prepareSortMatrixParam(sortedParams)}`, {paramsSerializer : encodedSerialize, params}); 
};
