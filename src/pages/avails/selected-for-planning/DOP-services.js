import moment from 'moment';
import config from 'react-global-configuration';
import {getUsername} from '../../../auth/authSelectors';
import {store} from '../../../index';
import {nexusFetch} from '../../../util/http-client/index';
import {PAGE_SIZE, getSearchPayload, PROJECT_ID, TABLE_FIELDS} from './constants';

const DEFAULT_TIMEOUT = 60000;

const DOPService = {
    getUsersProjectsList: (offset = 1, limit = PAGE_SIZE) => {
        const url = `${config.get('gateway.DOPUrl')}${config.get(
            'gateway.service.DOPProjectManagementProject'
        )}/search`;
        const body = getSearchPayload(getUsername(store.getState()), offset, limit);
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
                    value: TABLE_FIELDS,
                    logicalAnd: true,
                },
            ],
        };

        return nexusFetch(url, {method: 'post', body: JSON.stringify(body)});
    },
    createProjectRequestData: (data = []) => {
        const projectAttribute = [];
        data.forEach((right, index) => {
            projectAttribute.push({code: `selectedRightID[${index}]`, value: right.id});
            projectAttribute.push(
                ...right.territory.map((territory, territoryIndex) => ({
                    code: `selectedRightTerritory[${right.id}][${territoryIndex}]`,
                    value: territory.country,
                }))
            );
        });

        const utc = moment().utc();
        const username = getUsername(store.getState());
        return {
            name: `Rights Planning (${username}) ${utc.format('YYYYMMDDHHmmSS')}`,
            projectType: {id: PROJECT_ID},
            action: 'Provide',
            plannedStartDate: utc.toISOString(),
            manager: {userId: username},
            projectAttribute: [
                {
                    code: 'rightsPreSelected',
                    value: true,
                },
                ...projectAttribute,
            ],
        };
    },
    createProject: data => {
        const url = `${config.get('gateway.DOPUrl')}${config.get('gateway.service.DOPProjectManagementProject')}`;
        return nexusFetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    startProject: projectId => {
        const url = `${config.get('gateway.DOPUrl')}${config.get('gateway.service.DOPProjectManagementProject')}`;
        // TODO: Error handling if necessary
        return nexusFetch(`${url}/${projectId}/start`, {method: 'post'});
    },
};

export default DOPService;
