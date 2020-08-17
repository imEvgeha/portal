import moment from "moment";
import config from 'react-global-configuration';
import {getUsername} from '../../../auth/authSelectors';
import {store} from '../../../index';
import {nexusFetch} from '../../../util/http-client/index';
import {PAGE_SIZE, getSearchPayload, PROJECT_ID} from './constants';

const DEFAULT_TIMEOUT = 60000;
const username = getUsername(store.getState());

const DOPService = {
    getUsersProjectsList: (offset = 1, limit = PAGE_SIZE) => {
        const url = `${config.get('gateway.DOPUrl')}${config.get('gateway.service.DOPProjectManagementProject')}/search`;
        const body = getSearchPayload(username, offset, limit);
        return nexusFetch(url, {method: 'post', body: JSON.stringify(body)}, DEFAULT_TIMEOUT, true);
    },
    getProjectAttributes: (projectIds = []) => {
        const url = `${config.get('gateway.DOPUrl')}${config.get(
            'gateway.service.DOPProjectManagementBase'
        )}/projectAttribute`;
        const body = {
            filterCriterion: [
                {
                    fieldName: 'projectId',
                    operator: 'in',
                    value: projectIds.join(','),
                    logicalAnd: true,
                },
                {
                    fieldName: 'code',
                    operator: 'in',
                    value:
                        'PROJECT_NAME,format,licensee,licensor,platformCategory,releaseYear,rightID,title,transactionType',
                    logicalAnd: true,
                },
            ],
        };

        return nexusFetch(url, {method: 'post', body: JSON.stringify(body)});
    },
    createProjectRequestData: (data = []) => {
        const selectedRightArray = !!data.length && data.map((right, index) => {
            return {code: `selectedRightID[${index}]`, value: right.id}
        });

        const selectedTerritoryArray = () => {
            const arr = [];

            !!data.length && data.forEach(right => {
                right.territory.forEach((territory, territoryIndex) => {
                    arr.push({
                        code: `selectedRightTerritory[${right.id}][${territoryIndex}]`,
                        value: territory.country
                    });
                });
            });

            return arr;
        };

        const utc = moment().utc();

        const req = {
            name: `Rights Planning (${username}) ${utc.format('YYYYMMDDHHmmSS')}`,
            projectType: {id: PROJECT_ID},
            action: 'Provide',
            plannedStartDate: utc.toISOString(),
            manager: {userId: username},
            projectAttribute: [
                {
                    code: 'rightsPreSelected',
                    value: true
                },
                ...selectedRightArray,
                ...selectedTerritoryArray(),
            ],
        };

        return req;
    },
    createProject: (data) => {
        const url = `${config.get('gateway.DOPUrl')}${config.get('gateway.service.DOPProjectManagementProject')}`;
        return nexusFetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    startProject: ({projectId}) => {
        const url = `${config.get('gateway.DOPUrl')}${config.get('gateway.service.DOPProjectManagementProject')}`;
        // TODO: Error handling if necessary
        return nexusFetch(`${url}/${projectId}/start`, {method: 'post'});
    },
};

export default DOPService;
