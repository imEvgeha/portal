import {cloneDeep} from 'lodash';
import config from 'react-global-configuration';
import {getUsername} from '../../auth/authSelectors';
import {store} from '../../index';
import {nexusFetch} from '../../util/http-client/index';
import {INITIAL_SEARCH_PARAMS, USER, POTENTIAL_OWNERS, ALL} from './constants';

const PAGE_LIMIT = 100;
const DEFAULT_TIMEOUT = 60000;

const DopTasksService = {
    getTasks: (externalFilter, offset = 1, limit = PAGE_LIMIT) => {
        const url = `${config.get('gateway.DOPUrl')}/dop/be-services/taskManagement/task/search`;
        const payload = cloneDeep(INITIAL_SEARCH_PARAMS);
        const user = externalFilter.user === USER ? getUsername(store.getState()) : ALL;
        payload.filterCriterion[1].value = user;

        if (externalFilter.user !== USER) {
            payload.filterCriterion[1].fieldName = POTENTIAL_OWNERS;
        }

        const newSortCriterion = externalFilter.sortCriterion || [];
        if (newSortCriterion.length) {
            payload.sortCriterion = newSortCriterion;
        }
        const body = {
            ...payload,
            offset,
            limit,
        };
        return nexusFetch(url, {method: 'post', body: JSON.stringify(body)}, DEFAULT_TIMEOUT, true);
    },
};

export default DopTasksService;
