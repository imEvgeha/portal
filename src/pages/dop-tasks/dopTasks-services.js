import {cloneDeep} from 'lodash';
import config from 'react-global-configuration';
import {getUsername} from '../../auth/authSelectors';
import {store} from '../../index';
import {nexusFetch} from '../../util/http-client/index';
import {
    INITIAL_SEARCH_PARAMS,
    USER,
    ALL,
    ACTUAL_OWNER,
    POTENTIAL_OWNERS,
    PROJECT_STATUS_ENUM,
    STRING_FIELDS,
    DATE_FIELDS,
} from './constants';

const PAGE_LIMIT = 100;
const DEFAULT_TIMEOUT = 60000;

const DopTasksService = {
    getTasks: (externalFilter, offset = 1, limit = PAGE_LIMIT) => {
        const url = `${config.get('gateway.DOPUrl')}/dop/be-services/taskManagement/task/search`;
        const payload = prepareFilterPayload(INITIAL_SEARCH_PARAMS, externalFilter);
        const body = {...payload, offset, limit};
        return nexusFetch(url, {method: 'post', body: JSON.stringify(body)}, DEFAULT_TIMEOUT, true);
    },
};

const prepareFilterPayload = (initialParams, externalFilter) => {
    const payload = initialParams;

    Object.entries(externalFilter).map(([key, val]) => {
        if (STRING_FIELDS.includes(key)) {
            let updatedField = false;
            payload.filterCriterion.forEach((item, index) => {
                if (item.fieldName === key) {
                    updatedField = true;
                    payload.filterCriterion[index].value = val;
                    payload.filterCriterion[index].fieldName = key;
                    payload.filterCriterion[index].operator = 'contain';
                }
            });
            if (!updatedField) {
                payload.filterCriterion.push({
                    value: val,
                    fieldName: key,
                    operator: 'contain',
                    valueDataType: 'String',
                    logicalAnd: true,
                });
            }
        }
        if (key === 'taskStatus') {
            const taskStatusIndex = payload.filterCriterion.findIndex(item => item.fieldName === 'taskStatus');
            if (taskStatusIndex > -1) {
                payload.filterCriterion[taskStatusIndex].value = val.split(', ').join(',');
                payload.filterCriterion[taskStatusIndex].fieldName = key;
                payload.filterCriterion[taskStatusIndex].operator = 'in';
            } else {
                payload.filterCriterion.push({
                    value: val.split(', ').join(','),
                    fieldName: key,
                    operator: 'in',
                    valueDataType: 'String',
                    logicalAnd: true,
                });
            }
        }
        if (key === 'projectStatus') {
            const projectStatuses = val.split(', ');
            const filterResult = [];
            Object.keys(PROJECT_STATUS_ENUM).map(item => {
                projectStatuses.map(projectStatus => {
                    if (item.includes(projectStatus)) {
                        return filterResult.push(item);
                    }
                    return null;
                });
                return null;
            });
            const projectStatusIndex = payload.filterCriterion.findIndex(item => item.fieldName === 'projectStatus');
            if (projectStatusIndex > -1) {
                payload.filterCriterion[projectStatusIndex].value = filterResult.join(',');
                payload.filterCriterion[projectStatusIndex].fieldName = key;
                payload.filterCriterion[projectStatusIndex].operator = 'in';
            } else {
                payload.filterCriterion.push({
                    value: filterResult.join(','),
                    fieldName: key,
                    operator: 'in',
                    valueDataType: 'String',
                    logicalAnd: true,
                });
            }
        }
        if (DATE_FIELDS.includes(key)) {
            const [dateFrom, dateTo = null] = Object.values(val) || [];
            const dateIndex = payload.filterCriterion.findIndex(item => item.fieldName === key);
            if (dateIndex > -1) {
                payload.filterCriterion[dateIndex].value = dateFrom;
                payload.filterCriterion[dateIndex].fieldName = key;
                payload.filterCriterion[dateIndex].operator = 'equal';
                payload.filterCriterion[dateIndex].valueDataType = 'Date';
                if (dateTo) {
                    payload.filterCriterion[dateIndex].otherValue = dateTo;
                    payload.filterCriterion[dateIndex].operator = 'between';
                }
            } else {
                payload.filterCriterion.push({
                    value: dateFrom,
                    fieldName: key,
                    operator: 'equal',
                    valueDataType: 'Date',
                    logicalAnd: true,
                    ...(dateTo && {otherValue: dateTo, operator: 'between'}),
                });
            }
        }
        if (key === 'user') {
            const userIndex = payload.filterCriterion.findIndex(
                item => item.fieldName === POTENTIAL_OWNERS || item.fieldName === ACTUAL_OWNER
            );
            if (userIndex > -1) {
                payload.filterCriterion[userIndex].value = val === USER ? getUsername(store.getState()) : ALL;
                payload.filterCriterion[userIndex].fieldName = val === USER ? ACTUAL_OWNER : POTENTIAL_OWNERS;
            } else {
                payload.filterCriterion.push({
                    value: val === USER ? getUsername(store.getState()) : ALL,
                    fieldName: val === USER ? ACTUAL_OWNER : POTENTIAL_OWNERS,
                    logicalAnd: true,
                    operator: 'equal',
                    valueDataType: 'String',
                });
            }
        }
        if (key === 'sortCriterion' && val.length) {
            payload.sortCriterion = val;
        }
        return null;
    });

    return payload;
};

export default DopTasksService;
