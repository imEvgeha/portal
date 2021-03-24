import {setSorting} from '@vubiquity-nexus/portal-utils/lib/utils';
import DopTasksService from './dopTasks-services';

export const fetchDopTasksData = async (externalFilter, offset, limit) => {
    try {
        const [response, headers] = await DopTasksService.getTasks(externalFilter, offset + 1, limit);
        const data = response.reduce((acc, obj) => {
            const {
                name: taskName = '',
                id = null,
                status: taskStatus = '',
                customData = {},
                owner = {},
                potentialOwner = [],
            } = obj || {};
            const {
                activityEstimatedEndDate = '',
                projectName = '',
                projectId = '',
                OrderExternalID = '',
                Customer = '',
                servicingRegion = '',
                activityActualStartDate = '',
                activityActualEndDate = '',
                activityPlannedCompletionDate = '',
                projectStartDate = '',
                projectPlannedCompletionDate = '',
                projectStatus = '',
            } = customData || {};
            const potentialOwners = potentialOwner.map(item => item.userId).join(', ');
            const {userId: actualOwner} = owner || {};

            return [
                ...acc,
                {
                    taskName,
                    id,
                    taskStatus,
                    activityEstimatedEndDate,
                    projectName,
                    projectId,
                    OrderExternalID,
                    Customer,
                    servicingRegion,
                    potentialOwners,
                    actualOwner,
                    activityActualStartDate,
                    activityActualEndDate,
                    activityPlannedCompletionDate,
                    projectStartDate,
                    projectPlannedCompletionDate,
                    projectStatus,
                },
            ];
        }, []);

        const total = parseInt(headers.get('X-Total-Count') || data.length);

        return new Promise(res => {
            res({
                page: offset,
                size: limit,
                total,
                data,
            });
        });
    } catch (error) {
        return new Promise(res => {
            res({
                page: 0,
                size: 0,
                total: 0,
                data: [],
            });
        });
    }
};

export const applyPredefinedTableView = (gridApi, filter, columnApi) => {
    switch (filter) {
        case 'open': {
            clearAllDopTasksFilters(gridApi);
            setTaskStatusFilter(gridApi, ['READY', 'IN PROGRESS']);
            sortTaskStatus(columnApi);
            gridApi.onFilterChanged();
            break;
        }
        case 'all': {
            clearAllDopTasksFilters(gridApi);
            sortTaskStatus(columnApi);
            gridApi.onFilterChanged();
            break;
        }
        case 'notStarted': {
            clearAllDopTasksFilters(gridApi);
            setTaskStatusFilter(gridApi, ['READY']);
            sortTaskStatus(columnApi);
            gridApi.onFilterChanged();
            break;
        }
        case 'inProgress': {
            clearAllDopTasksFilters(gridApi);
            setTaskStatusFilter(gridApi, ['IN PROGRESS']);
            sortTaskStatus(columnApi);
            gridApi.onFilterChanged();
            break;
        }
        case 'closed': {
            clearAllDopTasksFilters(gridApi);
            setTaskStatusFilter(gridApi, ['COMPLETED', 'EXITED', 'OBSOLETE']);
            sortTaskStatus(columnApi);
            gridApi.onFilterChanged();
            break;
        }
        default:
        // no-op
    }
};

const setTaskStatusFilter = (gridApi, values) => {
    const filterInstance = gridApi.getFilterInstance('taskStatus');
    filterInstance.setModel({
        filterType: 'set',
        values,
    });
};

export const clearAllDopTasksFilters = api => {
    // aggrid setFilterModel function does not clear date filters, needs to be cleared and created manually
    if (api) {
        api.setFilterModel(null);
        api.destroyFilter('activityEstimatedEndDate');
        api.destroyFilter('activityActualStartDate');
        api.destroyFilter('activityActualEndDate');
        api.destroyFilter('activityPlannedCompletionDate');
        api.destroyFilter('projectStartDate');
        api.destroyFilter('projectPlannedCompletionDate');
        api.setFilterModel({
            activityEstimatedEndDate: {},
            activityActualStartDate: {},
            activityActualEndDate: {},
            activityPlannedCompletionDate: {},
            projectStartDate: {},
            projectPlannedCompletionDate: {},
        });
    }
};

const sortTaskStatus = api => {
    if (api) {
        setSorting(
            {
                colId: 'taskStatus',
                sort: 'asc',
            },
            api
        );
    }
};

export const insertNewGridModel = (viewId, userDefinedGridStates, model) => {
    const newUserData = userDefinedGridStates.slice();
    const foundIndex = newUserData.findIndex(obj => obj.id === viewId);
    if (foundIndex > -1) {
        newUserData[foundIndex] = model;
    } else {
        newUserData.push(model);
    }
    return newUserData;
};
