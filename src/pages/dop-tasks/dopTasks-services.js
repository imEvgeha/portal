import {cloneDeep} from 'lodash';
import config from 'react-global-configuration';
import {getUsername} from '../../auth/authSelectors';
import {store} from '../../index';
import {nexusFetch} from '../../util/http-client/index';
import {INITIAL_SEARCH_PARAMS, USER, ALL, ACTUAL_OWNER, POTENTIAL_OWNERS} from './constants';

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
    const {user, taskName, projectName, taskStatus, projectStatus, sortCriterion = []} = externalFilter || {};
    if (user === USER) {
        payload.filterCriterion[1].value = getUsername(store.getState());
        payload.filterCriterion[1].fieldName = ACTUAL_OWNER;
    }
    if (user === ALL) {
        payload.filterCriterion[1].value = ALL;
        payload.filterCriterion[1].fieldName = POTENTIAL_OWNERS;
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
    if (taskStatus) {
        payload.filterCriterion[0].value = taskStatus.split(', ').join(',');
    }
    if (projectStatus) {
        // TODO
    }
    if (sortCriterion.length) {
        payload.sortCriterion = sortCriterion;
    }

    return payload;
};

export default DopTasksService;
