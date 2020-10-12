import {cloneDeep} from 'lodash';
import config from 'react-global-configuration';
import {getUsername} from '../../auth/authSelectors';
import {store} from '../../index';
import {nexusFetch} from '../../util/http-client/index';
import {INITIAL_SEARCH_PARAMS, USER, ALL, ACTUAL_OWNER, POTENTIAL_OWNERS, PROJECT_STATUS_ENUM} from './constants';

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
    const payload = cloneDeep(initialParams);
    const {
        taskStatus,
        taskName,
        projectName,
        OrderExternalID,
        Customer,
        servicingRegion,
        potentialOwners,
        actualOwner,
        projectStatus,
        user,
        sortCriterion = [],
    } = externalFilter || {};
    if (taskStatus) {
        payload.filterCriterion[0].value = taskStatus.split(', ').join(',');
        payload.filterCriterion[0].fieldName = 'taskStatus';
        payload.filterCriterion[0].operator = 'in';
    }
    if (taskName) {
        payload.filterCriterion[0].value = taskName;
        payload.filterCriterion[0].fieldName = 'taskName';
        payload.filterCriterion[0].operator = 'contain';
    }
    if (projectName) {
        payload.filterCriterion[0].value = projectName;
        payload.filterCriterion[0].fieldName = 'projectName';
        payload.filterCriterion[0].operator = 'contain';
    }
    if (OrderExternalID) {
        payload.filterCriterion[0].value = OrderExternalID;
        payload.filterCriterion[0].fieldName = 'OrderExternalID';
        payload.filterCriterion[0].operator = 'contain';
    }
    if (Customer) {
        payload.filterCriterion[0].value = Customer;
        payload.filterCriterion[0].fieldName = 'Customer';
        payload.filterCriterion[0].operator = 'contain';
    }
    if (servicingRegion) {
        payload.filterCriterion[0].value = servicingRegion;
        payload.filterCriterion[0].fieldName = 'servicingRegion';
        payload.filterCriterion[0].operator = 'contain';
    }
    if (potentialOwners) {
        payload.filterCriterion[0].value = potentialOwners;
        payload.filterCriterion[0].fieldName = 'potentialOwners';
        payload.filterCriterion[0].operator = 'contain';
    }
    if (actualOwner) {
        payload.filterCriterion[0].value = actualOwner;
        payload.filterCriterion[0].fieldName = 'actualOwner';
        payload.filterCriterion[0].operator = 'contain';
    }
    if (projectStatus) {
        // TODO
        const projectStatuses = projectStatus.split(', ');
        const filterResult = [];
        Object.keys(PROJECT_STATUS_ENUM).map(key => {
            projectStatuses.map(projectStatus => {
                if (key.includes(projectStatus)) {
                    return filterResult.push(key);
                }
                return null;
            });
            return null;
        });
        payload.filterCriterion[0].value = filterResult.join(',');
        payload.filterCriterion[0].fieldName = 'projectStatus';
        payload.filterCriterion[0].operator = 'in';
    }
    if (user === USER) {
        payload.filterCriterion[payload.filterCriterion.length - 1].value = getUsername(store.getState());
        payload.filterCriterion[payload.filterCriterion.length - 1].fieldName = ACTUAL_OWNER;
    }
    if (user === ALL) {
        payload.filterCriterion[payload.filterCriterion.length - 1].value = ALL;
        payload.filterCriterion[payload.filterCriterion.length - 1].fieldName = POTENTIAL_OWNERS;
    }
    if (sortCriterion.length) {
        payload.sortCriterion = sortCriterion;
    }

    return payload;
};

export default DopTasksService;
