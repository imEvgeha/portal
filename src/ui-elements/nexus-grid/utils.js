import isEmpty from 'lodash.isempty';
import {parseAdvancedFilter} from '../../containers/avail/service/RightsService';
import moment from 'moment';
import Constants from './constants';

// grid filter
export const filterBy = filterObject => {
    const ALLOWED_TYPES_OPERAND = ['equals', 'inRange'];
    const FILTER_TYPES = ['set'];
    if (!isEmpty(filterObject)) {
        const filteredEqualsType = Object.keys(filterObject)
            .filter(key => ALLOWED_TYPES_OPERAND.includes(filterObject[key].type) || FILTER_TYPES.includes(filterObject[key].filterType))
            .reduce((obj, key) => {
                obj[key] = filterObject[key];
                return obj;
            }, {});
        const filterParams = Object.keys(filteredEqualsType).reduce((object, name) => {
            const {filter, values, filterType, dateFrom, dateTo} = filteredEqualsType[name] || {};
            object[name] = FILTER_TYPES.includes(filterType) ?
                Array.isArray(values) && values.join(', ') :
                (filter || {
                    [`${name}From`]: moment.utc(dateFrom).toISOString(),
                    [`${name}To`]: moment(moment.utc(dateTo).valueOf() + Constants.END_DATE_VALUE).toISOString()
                });
            return object;
        }, {});
        return parseAdvancedFilter(filterParams);
    }
    return {};
};

// grid sort
export const sortBy = sortModel => {
    return sortModel;
};
