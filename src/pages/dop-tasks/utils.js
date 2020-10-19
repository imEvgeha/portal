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
