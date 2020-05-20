import Constants from './constants';
import {URL} from '../../../util/Common';
import moment from 'moment';
import {DATE_FORMAT} from '../../legacy/constants/metadata/constant-variables';

const {STATUS_LIST, filterKeys: {LICENSOR, STATUS, RECEIVED_FROM, RECEIVED_TO}, URLFilterKeys} = Constants;

export const getInitialFilters = () => {
    const status = URL.getParamIfExists(URLFilterKeys[STATUS]);
    return {
        status: status ? { value: status, label: status} : STATUS_LIST[0],
        licensor: decodeURIComponent(URL.getParamIfExists(URLFilterKeys[LICENSOR])) || '',
        startDate: decodeURIComponent(URL.getParamIfExists(URLFilterKeys[RECEIVED_FROM])) || '',
        endDate: decodeURIComponent(URL.getParamIfExists(URLFilterKeys[RECEIVED_TO])) || '',
    };
};

export const getFiltersToSend = (filters) => {
    const {status=STATUS_LIST[0], licensor, startDate, endDate} = filters || getInitialFilters();
    return {
        [RECEIVED_FROM]: startDate,
        [RECEIVED_TO]: endDate,
        [STATUS]: status.value,
        [LICENSOR]: licensor,
    };
};

export const getValidDate = (date) => {
    if (date) {
        return moment(date).format(DATE_FORMAT);
    }
    return date;
};
