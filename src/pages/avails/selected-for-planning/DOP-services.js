import config from 'react-global-configuration';
import {store} from '../../../index';
import {nexusFetch} from '../../../util/http-client/index';
import {PAGE_SIZE, getSearchPayload} from './constants';
import {getUsername} from '../../../auth/authSelectors';

const username = getUsername(store.getState());

const DOPService = {
    getUsersProjectsList: (offset=1, limit=PAGE_SIZE) => {
        const url = `${config.get('gateway.DOPUrl')}${config.get('gateway.service.DOPProjectManagement')}/search`;
        const body = getSearchPayload(username, offset, limit);
        return nexusFetch(url, {method: 'post', body: JSON.stringify(body)});
    }
};

export default DOPService;