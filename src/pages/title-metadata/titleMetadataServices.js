// title metadata services
import config from 'react-global-configuration';
import {getDomainName, prepareSortMatrixParamTitles, encodedSerialize} from '../../util/Common';
import {nexusFetch} from '../../util/http-client/index';

export const titleService = {
    advancedSearch: (searchCriteria, page, size, sortedParams) => {
        const queryParams = {};
        for (const key in searchCriteria) {
            if (searchCriteria.hasOwnProperty(key) && searchCriteria[key]) {
                queryParams[key] = searchCriteria[key];
            }
        }
        const url = `${config.get('gateway.titleUrl')}${config.get(
            'gateway.service.title'
        )}/titles${prepareSortMatrixParamTitles(sortedParams)}`;
        const params = encodedSerialize({...queryParams, page, size});

        return nexusFetch(url, {params});
    },
};
