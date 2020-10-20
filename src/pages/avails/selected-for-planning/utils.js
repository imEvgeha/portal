import DOPService from './DOP-services.js';
import {EXCLUDED_STATUSES} from './constants.js';

export const prepareSelectForPlanningData = async (sort, offset, limit) => {
    try {
        // Using object for easier parsing of getProjectAttributes response
        let data = {};

        // Fetch all active projects for the current user
        // N.B. offset + 1 because DOP API starts counting pages from 1
        //      while the rest of the APIs start from 0
        const [projectsList, headers] = await DOPService.getUsersProjectsList(offset + 1, limit);
        const projectIds = [];

        // Extract project IDs for incomplete projects to display in SelectForPlanning table
        projectsList.forEach(({id, status}) => {
            if (!EXCLUDED_STATUSES.includes(status)) {
                projectIds.push(id);
                data[id] = {status};
            }
        });

        // Fetch project data and build rowData for ag-grid
        const projectAttributes = await DOPService.getProjectAttributes(projectIds);

        projectAttributes.forEach(({code, value, projectId}) => {
            data[projectId][code] = value;
            // Adding projectId to be used for starting DOP project
            // in cellRenderer's onClick
            data[projectId]['projectId'] = projectId;
        });
        // Convert object to an array
        data = Object.values(data);
        const total = headers.get('X-Total-Count') || data.length;
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
