import store from '../../../stores/index';
import {
    searchFormUpdateAdvancedHistorySearchCriteria
} from '../../../stores/actions/avail/history';
import {historyServiceManager} from './HistoryServiceManager';
import {momentToISO, safeTrim} from '../../../util/Common';
import HistoryURL from '../util/HistoryUtils';

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
        HistoryURL.saveHistoryAdvancedFilterUrl({});
        store.dispatch(searchFormUpdateAdvancedHistorySearchCriteria({
           received: null,
           provider: '',
           status: '',
        }));
    },

    advancedSearch(searchCriteria) {
        HistoryURL.saveHistoryAdvancedFilterUrl(searchCriteria);
        historyServiceManager.search(this.prepareAdvancedHistorySearchCall(searchCriteria));
    }
};
