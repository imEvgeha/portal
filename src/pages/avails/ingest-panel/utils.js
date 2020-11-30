import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import Constants from './constants';

const {
    STATUS_LIST,
    filterKeys: {LICENSOR, STATUS, RECEIVED_FROM, RECEIVED_TO},
    URLFilterKeys,
} = Constants;

export const getInitialFilters = () => {
    const status = URL.getParamIfExists(URLFilterKeys[STATUS]);
    return {
        status: status ? {value: status, label: status} : STATUS_LIST[0],
        licensor: decodeURIComponent(URL.getParamIfExists(URLFilterKeys[LICENSOR])) || '',
        startDate: decodeURIComponent(URL.getParamIfExists(URLFilterKeys[RECEIVED_FROM])) || '',
        endDate: decodeURIComponent(URL.getParamIfExists(URLFilterKeys[RECEIVED_TO])) || '',
    };
};

export const getFiltersToSend = filters => {
    const {status = STATUS_LIST[0], licensor, startDate, endDate} = filters || getInitialFilters();
    return {
        [RECEIVED_FROM]: startDate,
        [RECEIVED_TO]: endDate,
        [STATUS]: status.value,
        [LICENSOR]: licensor,
    };
};
