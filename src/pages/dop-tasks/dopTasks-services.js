import {cloneDeep} from 'lodash';
import config from 'react-global-configuration';
import {getUsername} from '../../auth/authSelectors';
import {store} from '../../index';
import {nexusFetch} from '../../util/http-client/index';
import {
    INITIAL_SEARCH_PARAMS,
    USER,
    ALL,
    ACTUAL_OWNER,
    POTENTIAL_OWNERS,
    PROJECT_STATUS_ENUM,
    STRING_FIELDS,
    DATE_FIELDS,
} from './constants';

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

    Object.entries(externalFilter).map(([key, val]) => {
        if (STRING_FIELDS.includes(key)) {
            payload.filterCriterion[0].value = val;
            payload.filterCriterion[0].fieldName = key;
            payload.filterCriterion[0].operator = 'contain';
        }
        if (key === 'taskStatus') {
            payload.filterCriterion[0].value = val.split(', ').join(',');
            payload.filterCriterion[0].fieldName = key;
            payload.filterCriterion[0].operator = 'in';
        }
        if (key === 'projectStatus') {
            const projectStatuses = val.split(', ');
            const filterResult = [];
            Object.keys(PROJECT_STATUS_ENUM).map(item => {
                projectStatuses.map(projectStatus => {
                    if (item.includes(projectStatus)) {
                        return filterResult.push(item);
                    }
                    return null;
                });
                return null;
            });
            payload.filterCriterion[0].value = filterResult.join(',');
            payload.filterCriterion[0].fieldName = key;
            payload.filterCriterion[0].operator = 'in';
        }
        if (DATE_FIELDS.includes(key)) {
            const [dateFrom, dateTo = null] = Object.values(val) || [];
            payload.filterCriterion[0].value = dateFrom;
            payload.filterCriterion[0].fieldName = key;
            payload.filterCriterion[0].operator = 'equal';
            payload.filterCriterion[0].valueDataType = 'Date';
            if (dateTo) {
                payload.filterCriterion[0].otherValue = dateTo;
                payload.filterCriterion[0].operator = 'between';
            }
        }
        if (key === 'user' && val === USER) {
            payload.filterCriterion[payload.filterCriterion.length - 1].value = getUsername(store.getState());
            payload.filterCriterion[payload.filterCriterion.length - 1].fieldName = ACTUAL_OWNER;
        }
        if (key === 'user' && val === ALL) {
            payload.filterCriterion[payload.filterCriterion.length - 1].value = ALL;
            payload.filterCriterion[payload.filterCriterion.length - 1].fieldName = POTENTIAL_OWNERS;
        }
        if (key === 'sortCriterion' && val.length) {
            payload.sortCriterion = val;
        }
        return null;
    });

    return payload;
};

export default DopTasksService;
