import {getUsername} from '@vubiquity-nexus/portal-auth/authSelectors';
import {getConfig} from '@vubiquity-nexus/portal-utils/lib/config';
import {nexusFetch} from '@vubiquity-nexus/portal-utils/lib/http-client';
import {store} from '../../index';
import {
    ACTUAL_OWNER,
    ALL,
    DATE_FIELDS,
    FIELDS_OPERATOR_IN,
    INITIAL_SEARCH_PARAMS,
    POTENTIAL_OWNERS,
    PROJECT_STATUS_ENUM,
    STRING_FIELDS,
    USER,
} from './constants';

const PAGE_LIMIT = 100;
const DEFAULT_TIMEOUT = 60000;

const DopTasksService = {
    getTasks: (externalFilter, offset = 1, limit = PAGE_LIMIT) => {
        const url = `${getConfig('gateway.DOPUrl')}/dop/be-services/taskManagement/task/search`;
        const payload = prepareFilterPayload(INITIAL_SEARCH_PARAMS, externalFilter);
        const body = {...payload, offset, limit};
        return nexusFetch(
            url,
            {method: 'post', credentials: 'include', body: JSON.stringify(body)},
            DEFAULT_TIMEOUT,
            true
        );
    },
    getOwners: taskIds => {
        const url = `${getConfig('gateway.DOPUrl')}${getConfig('gateway.service.DOPTasksPotentialOwners')}${
            taskIds ? `?taskId=${taskIds}` : ''
        }`;
        return nexusFetch(url, {credentials: 'include'});
    },
    assignTask: (taskIds, userId) => {
        const url = `${getConfig('gateway.DOPUrl')}${getConfig('gateway.service.DOPTasksAssign')}`;
        const dataToSend = {
            assignmentDetail: {
                action: 'DELEGATE',
                assignee: {userId},
                isoverrideExistingAssignment: true,
            },
            taskList: taskIds.map(t => ({id: t})),
        };
        return nexusFetch(
            url,
            {
                method: 'post',
                credentials: 'include',
                body: JSON.stringify(dataToSend),
            },
            DEFAULT_TIMEOUT,
            true
        );
    },
    unAssignTask: taskIds => {
        const url = `${getConfig('gateway.DOPUrl')}${getConfig('gateway.service.DOPTasksAssign')}`;
        const dataToSend = {
            assignmentDetail: {
                isoverrideExistingAssignment: true,
                action: 'RELEASE',
            },
            taskList: taskIds.map(t => ({id: t})),
        };
        return nexusFetch(
            url,
            {
                method: 'post',
                credentials: 'include',
                body: JSON.stringify(dataToSend),
            },
            DEFAULT_TIMEOUT,
            true
        );
    },
    forwardTask: (taskIds, userId) => {
        const url = `${getConfig('gateway.DOPUrl')}${getConfig('gateway.service.DOPTasksForward')}`;
        const dataToSend = {
            forwardDetail: {
                targetWorkQueue: userId,
                isoverrideExistingAssignment: true,
            },
            taskList: taskIds.map(t => ({id: t})),
        };
        return nexusFetch(
            url,
            {
                method: 'post',
                credentials: 'include',
                body: JSON.stringify(dataToSend),
            },
            DEFAULT_TIMEOUT,
            true
        );
    },
    getBatchJobStatus: jobId => {
        const url = `${getConfig('gateway.DOPUrl')}${getConfig('gateway.service.DOPTasksBatchJob')}/${jobId}`;
        return nexusFetch(url, {credentials: 'include'});
    },
    changePriority: (taskIds, priority) => {
        const url = `${getConfig('gateway.DOPUrl')}${getConfig(
            'gateway.service.DOPProjectManagementBase'
        )}/projectAttribute`;
        const dataToSend = [...new Set(taskIds)].map(id => ({
            projectId: id,
            code: 'customPriority',
            value: priority,
        }));
        return nexusFetch(
            url,
            {
                method: 'put',
                credentials: 'include',
                body: JSON.stringify(dataToSend),
            },
            DEFAULT_TIMEOUT,
            true
        );
    },
};

const prepareFilterPayload = (initialParams, externalFilter) => {
    const payload = initialParams;
    const activeFilters = Object.keys(externalFilter);

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
        if (key === 'actualOwner') {
            const actualOwnerAsSearchParamIndex = payload.filterCriterion.findIndex(
                item => item.fieldName === key && item.operator === 'contain'
            );
            if (actualOwnerAsSearchParamIndex > -1) {
                payload.filterCriterion[actualOwnerAsSearchParamIndex].value = val;
                payload.filterCriterion[actualOwnerAsSearchParamIndex].fieldName = key;
                payload.filterCriterion[actualOwnerAsSearchParamIndex].operator = 'contain';
            } else {
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
            const dateFrom = val[`${key}From`] || null;
            const dateTo = val[`${key}To`] || null;
            const dateIndex = payload.filterCriterion.findIndex(item => item.fieldName === key);
            const operator = dateFrom ? (dateTo ? 'between' : 'moreEqual') : 'lessEqual';
            const otherValue = dateFrom && dateTo ? dateTo : '';
            if (dateIndex > -1) {
                if (dateFrom || dateTo) {
                    payload.filterCriterion[dateIndex].operator = operator;
                    payload.filterCriterion[dateIndex].value = dateFrom || dateTo;
                    payload.filterCriterion[dateIndex].otherValue = otherValue;
                } else {
                    payload.filterCriterion.splice(dateIndex, 1);
                }
            } else {
                payload.filterCriterion.push({
                    fieldName: key,
                    logicalAnd: true,
                    value: dateFrom || dateTo,
                    valueDataType: 'date',
                    otherValue,
                    operator,
                });
            }
        }
        if (key === 'user' && !activeFilters.includes(POTENTIAL_OWNERS)) {
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
        if (FIELDS_OPERATOR_IN.includes(key) && val) {
            const searchItemsArray = val.split(', ');
            const searchItemsArrayLength = searchItemsArray.length;
            const isThereTerritoryItem = payload.filterCriterion.find(item => item.fieldName === key);
            if (isThereTerritoryItem)
                payload.filterCriterion = payload.filterCriterion.filter(item => item.fieldName !== key);

            searchItemsArray.forEach((item, index) => {
                const territoryFilter = {
                    value: item,
                    fieldName: key,
                    operator: 'contain',
                    valueDataType: 'String',
                    logicalAnd: false,
                };

                if (searchItemsArrayLength - 1 === index) {
                    payload.filterCriterion.push({
                        ...territoryFilter,
                        logicalAnd: !(searchItemsArrayLength - 1),
                        closeParenNumber: 1,
                    });
                    return;
                }
                if (index === 0) {
                    payload.filterCriterion.push({
                        ...territoryFilter,
                        openParenNumber: 1,
                        logicalAnd: true,
                    });
                    return;
                } else if (index) {
                    payload.filterCriterion.push(territoryFilter);
                    return;
                }
            });
        }
        if (FIELDS_OPERATOR_IN.includes(key) && !val) {
            payload.filterCriterion = payload.filterCriterion.filter(item => item.fieldName !== key);
        }
        return null;
    });
    payload.filterCriterion = payload.filterCriterion.filter(
        entry =>
            activeFilters.includes(entry.fieldName) ||
            ([ACTUAL_OWNER, POTENTIAL_OWNERS].includes(entry.fieldName) && entry.operator === 'equal')
    );
    return payload;
};

export default DopTasksService;
