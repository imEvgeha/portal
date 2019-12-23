import Constants from './Constants';

const {STATUS_LIST, filterKeys: {PROVIDER, STATUS, RECEIVED_FROM, RECEIVED_TO}} = Constants;
export const getFiltersToSend = (filters) => {
    if(!filters) return {};
    const {status=STATUS_LIST[0], provider, startDate, endDate} = filters;
    return {
        [RECEIVED_FROM]: startDate,
        [RECEIVED_TO]: endDate,
        [STATUS]: status.value,
        [PROVIDER]: provider,
    };
};