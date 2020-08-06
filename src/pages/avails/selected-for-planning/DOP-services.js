import config from 'react-global-configuration';
import {getUsername} from '../../../auth/authSelectors';
import {store} from '../../../index';
import {nexusFetch} from '../../../util/http-client/index';
import {PAGE_SIZE, getSearchPayload, PROJECT_ATTRIBUTE_MOCK_RESPONSE, PROJECT_SEARCH_MOCK_RESPONSE} from './constants';

const username = getUsername(store.getState());

const DOPService = {
    getUsersProjectsList: (offset = 1, limit = PAGE_SIZE) => {
        const url = `${config.get('gateway.DOPUrl')}${config.get('gateway.service.DOPProjectManagement')}/search`;
        const body = getSearchPayload(username, offset, limit);
        // return nexusFetch(url, {method: 'post', body: JSON.stringify(body)});
        return new Promise((resolve, reject) => {
            resolve(PROJECT_SEARCH_MOCK_RESPONSE);
        });
    },
    getProjectAttributes: (projectIds = []) => {
        const url = `${config.get('gateway.DOPUrl')}${config.get(
            'gateway.service.DOPProjectManagement'
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
                        'PROJECT_NAME, format, licensee, licensor, platformCategory, releaseYear, rightID, title, transactionType',
                    logicalAnd: true,
                },
            ],
        };

        // return nexusFetch(url, {method: 'post', mode: 'no-cors', body: JSON.stringify(body)});
        return new Promise((resolve, reject) => {
            resolve(PROJECT_ATTRIBUTE_MOCK_RESPONSE);
        });
    },
    createProjectRequestData: (data = [], id) => {
        const selectedRightArray = !!data.length && data.map((right, index) => {
            return { code: `selectedRightID[${index}]`, value: right.id}
        });
        const selectedTerritoryArray = !!data.length && data.map((index,right) => {
            const arr = [];
            right.territory.map((territory, territoryIndex) => {
                arr.push({code: `selectedRightTerritory[${right.id}][${territoryIndex}]`, value: territory.country});
            });
            return arr;
        });
        let req = {
            name : `Rights Planning (${username}) timestamp`,
            projectType : { id },
            action : 'Provide',
            plannedStartDate:"2020-07-21T03:06:39.000Z",
            manager: { userId :username },
            projectAttribute :[
                {
                    code: "rightsPreSelected",
                    value: true
                },
                ...selectedRightArray,
                ...selectedTerritoryArray
            ]
        };

    },
    createProject: (data) => {
        const url = `${config.get('gateway.DOPUrl')}${config.get('gateway.service.DOPProjectManagement')}`;
        return nexusFetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    startProject: ({data = {}}) => {
        const url = `${config.get('gateway.DOPUrl')}${config.get('gateway.service.DOPProjectManagement')}`;
        // TODO: Error handling if necessary
        nexusFetch(`${url}/${data.projectId || ''}/start`, {method: 'post'});
    },
};

export default DOPService;
