import store from '../../../stores/index';
import {
    searchFormSetAdvancedHistorySearchCriteria,
    searchFormSetHistorySearchCriteria
} from '../../../stores/actions/avail/history';
import {historyServiceManager} from './HistoryServiceManager';
import {momentToISO} from '../../../util/Common';

export const advancedHistorySearchHelper = {

    prepareAdvancedHistorySearchCall: (searchCriteria) => {
        const response = {};
        for (let key of Object.keys(searchCriteria) ) {
            const criteria = searchCriteria[key];
            if (criteria) {
                if (!(criteria instanceof Object)) {
                    response[key] = criteria.trim();
                } else if (criteria.value) {
                    response[key] = criteria.value.trim();
                } else {
                    if (criteria.from) {
                        response[key + 'From'] = momentToISO(criteria.from);
                    }
                    if (criteria.to) {
                        response[key + 'To'] = momentToISO(criteria.to);
                    }
                }
            }
        }
        return response;
    },

    clearAdvancedHistorySearchForm: () => {
        store.dispatch(searchFormSetAdvancedHistorySearchCriteria({
           received: null,
           provider: '',
           status: '',
        }));
        store.dispatch(searchFormSetHistorySearchCriteria({
           received: null,
           provider: '',
           status: '',
        }));
    },

    advancedSearch(searchCriteria) {
        historyServiceManager.search(this.prepareAdvancedHistorySearchCall(searchCriteria));
    }
};