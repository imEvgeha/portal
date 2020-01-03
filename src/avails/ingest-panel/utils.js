import Constants from './Constants';
import {URL} from '../../util/Common';

const {STATUS_LIST, filterKeys: {PROVIDER, STATUS, RECEIVED_FROM, RECEIVED_TO}, URLFilterKeys} = Constants;

export const getInitialFilters = () => {
    const status = URL.getParamIfExists(URLFilterKeys[STATUS]);
    return {
        status: status ? { value: status, label: status} : STATUS_LIST[0],
        provider: decodeURIComponent(URL.getParamIfExists(URLFilterKeys[PROVIDER])) || '',
        startDate: decodeURIComponent(URL.getParamIfExists(URLFilterKeys[RECEIVED_FROM])) || '',
        endDate: decodeURIComponent(URL.getParamIfExists(URLFilterKeys[RECEIVED_TO])) || '',
    };
};

export const getFiltersToSend = (filters) => {
    const {status=STATUS_LIST[0], provider, startDate, endDate} = filters || getInitialFilters();
    return {
        [RECEIVED_FROM]: startDate,
        [RECEIVED_TO]: endDate,
        [STATUS]: status.value,
        [PROVIDER]: provider,
    };
};