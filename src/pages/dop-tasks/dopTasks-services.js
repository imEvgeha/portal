import moment from 'moment';
import config from 'react-global-configuration';
import {getUsername} from '../../auth/authSelectors';
import {store} from '../../index';
import {nexusFetch} from '../../util/http-client/index';
import {getSearchPayload} from './constants';

const PAGE_LIMIT = 100;
const DEFAULT_TIMEOUT = 60000;

const DopTasksService = {
    getTasks: (offset = 1, limit = PAGE_LIMIT) => {
        const url = `${config.get('gateway.DOPUrl')}/dop/be-services/taskManagement/task/search`;
        const body = getSearchPayload(getUsername(store.getState()), offset, limit);
        return nexusFetch(url, {method: 'post', body: JSON.stringify(body)}, DEFAULT_TIMEOUT);
    },
};

export default DopTasksService;
