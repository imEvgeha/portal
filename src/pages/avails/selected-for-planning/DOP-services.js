import {getUsername} from '@vubiquity-nexus/portal-auth/authSelectors';
import moment from 'moment';
import config from 'react-global-configuration';
import {store} from '../../../index';
import {nexusFetch} from '../../../util/http-client/index';
import {PAGE_SIZE, getInitialSearchPayload, PROJECT_ID, TABLE_FIELDS} from './constants';

const DEFAULT_TIMEOUT = 60000;

const DOPService = {
    getSecurityTicket: token => {
        const url = `${config.get('gateway.DOPUrl')}${config.get('gateway.service.DOPLoginWithKeycloak')}`;
        return nexusFetch(
            url,
            {method: 'post', credentials: 'include', body: JSON.stringify(token)},
            DEFAULT_TIMEOUT,
            true
        );
    },
    getUsersProjectsList: (externalFilter, offset = 1, limit = PAGE_SIZE) => {
        const url = `${config.get('gateway.DOPUrl')}${config.get(
            'gateway.service.DOPProjectManagementProject'
        )}/search`;
        const payload = getInitialSearchPayload(getUsername(store.getState()), offset, limit);
        const body = prepareFilters(payload, externalFilter);
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
            projectAttribute.push({
                code: `selectedRightTerritory[${right.id}]`,
                value: right.territory.map(territory => territory.country).toString(),
            });
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

const prepareFilters = (payload, externalFilter) => {
    Object.entries(externalFilter).map(([key, value]) => {
        if (key === 'sortCriterion') {
            payload.sortCriterion = [
                {
                    fieldName: `projectAttribute.${value[0].fieldName}`,
                    ascending: value[0].ascending,
                },
            ];
        } else {
            payload.filterCriterion = [
                ...payload.filterCriterion,
                {
                    fieldName: `projectAttribute.${key}`,
                    valueDataType: 'String',
                    operator: 'contain',
                    logicalAnd: true,
                    value: key === 'licenseType' ? value.toLowerCase() : value,
                },
            ];
        }
        return null;
    });
    return payload;
};
