import store from '../../../stores/index';
import {
    searchFormSetSearchCriteria,
    searchFormSetAdvancedSearchCriteria,
} from '../../../stores/actions/avail/dashboard';

import {availServiceManager} from './service/AvailServiceManager';
import {momentToISO} from '../../../util/Common';

export const availSearchHelper = {

    loadAdvancedSearchForm: (filter) => {
        store.dispatch(searchFormSetAdvancedSearchCriteria(filter));
    },

    prepareAdvancedSearchCall: (searchCriteria) => {
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

    clearAdvancedSearchForm: () => {
        store.dispatch(searchFormSetAdvancedSearchCriteria({}));
        store.dispatch(searchFormSetSearchCriteria({}));
    },

    freeTextSearch(searchCriteria) {
        availServiceManager.search(this.prepareAdvancedSearchCall(searchCriteria));
    },

    advancedSearch(searchCriteria) {
        availServiceManager.search(this.prepareAdvancedSearchCall(searchCriteria));
    }

};