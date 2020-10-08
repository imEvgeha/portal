import {cloneDeep} from 'lodash';
import config from 'react-global-configuration';
import {getUsername} from '../../auth/authSelectors';
import {store} from '../../index';
import {nexusFetch} from '../../util/http-client/index';
import {INITIAL_SEARCH_PARAMS, USER, ALL} from './constants';

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
    const {user, taskStatus, projectStatus, sortCriterion = []} = externalFilter || {};
    if (user) {
        payload.filterCriterion[1].value = externalFilter.user === USER ? getUsername(store.getState()) : ALL;
    }
    if (taskStatus) {
        payload.filterCriterion[0].value = taskStatus;
    }
    if (projectStatus) {
        // TODO: fix this when api support is ready
        // payload.filterCriterion[0].fieldName = 'projectStatus';
        // payload.filterCriterion[0].value = projectStatus;
    }
    if (sortCriterion.length) {
        payload.sortCriterion = sortCriterion;
    }

    return payload;
};

export default DopTasksService;
