import isEmpty from 'lodash.isempty';
import {parseAdvancedFilter} from '../../containers/avail/service/RightsService';

// grid filter
export const filterBy = filterObject => {
    const ALLOWED_TYPES_OPERAND = ['equals'];
    const FILTER_TYPES = ['set'];
    if (!isEmpty(filterObject)) {
        const filteredEqualsType = Object.keys(filterObject)
            .filter(key => ALLOWED_TYPES_OPERAND.includes(filterObject[key].type) || FILTER_TYPES.includes(filterObject[key].filterType))
            .reduce((obj, key) => {
                obj[key] = filterObject[key];
                return obj;
            }, {});
        const filterParams = Object.keys(filteredEqualsType).reduce((object, name) => {
            const {filter, values, filterType} = filteredEqualsType[name] || {};
            object[name] = FILTER_TYPES.includes(filterType) ? Array.isArray(values) && values.join(', ') : filter;
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
