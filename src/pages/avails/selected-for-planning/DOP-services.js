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
    startProject: ({data = {}}) => {
        const url = `${config.get('gateway.DOPUrl')}${config.get('gateway.service.DOPProjectManagement')}`;
        // TODO: Error handling if necessary
        nexusFetch(`${url}/${data.projectId || ''}/start`, {method: 'post'});
    },
};

export default DOPService;
