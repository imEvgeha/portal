import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import Constants from './constants';

const {
    STATUS_LIST,
    filterKeys: {LICENSOR, STATUS, INGEST_TYPE, RECEIVED_FROM, RECEIVED_TO},
    URLFilterKeys,
    INGEST_LIST
} = Constants;

export const getInitialFilters = () => {
    const status = URL.getParamIfExists(URLFilterKeys[STATUS]);
    const ingestType = URL.getParamIfExists(URLFilterKeys[INGEST_TYPE]);
    return {
        status: status ? {value: status, label: status} : STATUS_LIST[0],
        ingestType: ingestType ? {value: ingestType, label: ingestType} : INGEST_LIST[0],
        licensor: decodeURIComponent(URL.getParamIfExists(URLFilterKeys[LICENSOR])) || '',
        startDate: decodeURIComponent(URL.getParamIfExists(URLFilterKeys[RECEIVED_FROM])) || '',
        endDate: decodeURIComponent(URL.getParamIfExists(URLFilterKeys[RECEIVED_TO])) || '',
    };
};

export const getFiltersToSend = filters => {
    const {status = STATUS_LIST[0], licensor, ingestType= INGEST_LIST[0],startDate, endDate} = filters || getInitialFilters();
    return {
        [RECEIVED_FROM]: startDate,
        [RECEIVED_TO]: endDate,
        [STATUS]: status.value,
        [LICENSOR]: licensor,
        [INGEST_TYPE]: ingestType.value,
    };
};
