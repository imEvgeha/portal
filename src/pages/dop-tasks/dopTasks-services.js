import {cloneDeep} from 'lodash';
import config from 'react-global-configuration';
import {getUsername} from '../../auth/authSelectors';
import {store} from '../../index';
import {nexusFetch} from '../../util/http-client/index';
import {INITIAL_CRITERIA} from './constants';

const PAGE_LIMIT = 100;
const DEFAULT_TIMEOUT = 60000;

const DopTasksService = {
    getTasks: (externalFilter, offset = 1, limit = PAGE_LIMIT) => {
        const url = `${config.get('gateway.DOPUrl')}/dop/be-services/taskManagement/task/search`;
        const payload = cloneDeep(INITIAL_CRITERIA);
        const user = externalFilter.user === 'user' ? getUsername(store.getState()) : '*';
        payload.filterCriterion[1].value = user;

        const body = {
            ...payload,
            offset,
            limit,
        };
        return nexusFetch(url, {method: 'post', body: JSON.stringify(body)}, DEFAULT_TIMEOUT, true);
    },
};

export default DopTasksService;
