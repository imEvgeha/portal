import Constants from './Constants';
import {URL} from '../../util/Common';

const {STATUS_LIST, filterKeys: {PROVIDER, STATUS, RECEIVED_FROM, RECEIVED_TO}} = Constants;

export const getInitialFilters = () => {
    const status = URL.getParamIfExists(STATUS);
    return {
        status: status ? { value: status, label: status} : STATUS_LIST[0],
        provider: URL.getParamIfExists(PROVIDER) || '',
        startDate: URL.getParamIfExists(RECEIVED_FROM) || '',
        endDate: URL.getParamIfExists(RECEIVED_TO) || '',
    };
};

export const getFiltersToSend = (filters) => {
    const {status=STATUS_LIST[0], provider, startDate, endDate} = filters || getInitialFilters();
    const filtersToSend = {
        [RECEIVED_FROM]: startDate,
        [RECEIVED_TO]: endDate,
        [STATUS]: status.value,
        [PROVIDER]: provider,
    };
    Object.keys(filtersToSend).forEach(key => (!filtersToSend[key]) && delete filtersToSend[key]);
    return filtersToSend;
};