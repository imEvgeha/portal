import {URL} from '@vubiquity-nexus/portal-utils/lib/Common';
import Constants from './constants';

const {
    STATUS_LIST,
    filterKeys: {LICENSOR, STATUS, INGEST_TYPE, RECEIVED_FROM, RECEIVED_TO, EMAIL_SUBJECT, FILE_NAME},
    URLFilterKeys,
    INGEST_LIST,
} = Constants;

export const getInitialFilters = () => {
    const status = URL.getParamIfExists(URLFilterKeys[STATUS]);
    const ingestType = URL.getParamIfExists(URLFilterKeys[INGEST_TYPE]);
    return {
        status: status ? {value: status, label: status} : STATUS_LIST[0],
        ingestType: ingestType ? {value: ingestType, label: ingestType} : INGEST_LIST[0],
        licensor: URL.getParamIfExists(URLFilterKeys[LICENSOR]) || '',
        startDate: URL.getParamIfExists(URLFilterKeys[RECEIVED_FROM]) || '',
        endDate: URL.getParamIfExists(URLFilterKeys[RECEIVED_TO]) || '',
        [EMAIL_SUBJECT]: URL.getParamIfExists(URLFilterKeys[EMAIL_SUBJECT]) || '',
        [FILE_NAME]: URL.getParamIfExists(URLFilterKeys[FILE_NAME]) || '',
    };
};

export const getFiltersToSend = filters => {
    const {
        status = STATUS_LIST[0],
        licensor,
        ingestType = INGEST_LIST[0],
        startDate,
        endDate,
        [FILE_NAME]: fileName,
        [EMAIL_SUBJECT]: subject,
    } = filters || getInitialFilters();
    return {
        [RECEIVED_FROM]: startDate,
        [RECEIVED_TO]: endDate,
        [STATUS]: status.value,
        [LICENSOR]: licensor,
        [INGEST_TYPE]: ingestType.value,
        [EMAIL_SUBJECT]: subject,
        [FILE_NAME]: fileName,
    };
};
