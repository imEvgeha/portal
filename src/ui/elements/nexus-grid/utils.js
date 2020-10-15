import {isEmpty} from 'lodash';

// grid filter
export const filterBy = (filterObject, prepareFilter = params => params) => {
    const ALLOWED_TYPES_OPERAND = ['equals', 'range'];
    const FILTER_TYPES = ['set'];
    if (!isEmpty(filterObject)) {
        const filteredEqualsType = Object.keys(filterObject)
            .filter(
                key =>
                    ALLOWED_TYPES_OPERAND.includes(filterObject[key].type) ||
                    FILTER_TYPES.includes(filterObject[key].filterType)
            )
            .reduce((obj, key) => {
                obj[key] = filterObject[key];
                return obj;
            }, {});
        const filterParams = Object.keys(filteredEqualsType).reduce((object, name) => {
            const {filter, values, filterType} = filteredEqualsType[name] || {};
            object[name] = FILTER_TYPES.includes(filterType) ? Array.isArray(values) && values.join(', ') : filter;
            return object;
        }, {});

        return prepareFilter(filterParams);
    }
    return {};
};

// grid sort
export const sortBy = sortModel => {
    return sortModel;
};
