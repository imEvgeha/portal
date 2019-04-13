import store from '../../../stores/index';
import {
    searchFormSetAdvancedHistorySearchCriteria
} from '../../../stores/actions/avail/history';
import {historyServiceManager} from './HistoryServiceManager';
import {safeTrim} from '../../../util/Common';
import moment from 'moment';

export const advancedHistorySearchHelper = {

    prepareAdvancedHistorySearchCall: (searchCriteria) => {
        const response = {};
        for (let key of Object.keys(searchCriteria) ) {
            const criteria = searchCriteria[key];
            if (criteria !== null && criteria !== undefined) {
                if (!(criteria instanceof Object)) {
                    response[key] = safeTrim(criteria);
                } else if (criteria.value || criteria.value === false) {
                    response[key] = safeTrim(criteria.value);
                } else {
                    if (criteria.from) {
                        response[key + 'From'] = moment(criteria.from).toISOString();
                    }
                    if (criteria.to) {
                        const val = moment(criteria.to);
                        if(criteria.to.indexOf('Z')>-1) val.utc();
                        response[key + 'To'] = val.endOf('day').toISOString();
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
    },

    advancedSearch(searchCriteria) {
        historyServiceManager.search(this.prepareAdvancedHistorySearchCall(searchCriteria));
    }
};
