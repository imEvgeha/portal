import store from '../../../stores/index';
import {
    searchFormSetSearchCriteria,
    searchFormSetAdvancedSearchCriteria,
} from '../../../stores/actions/avail/dashboard';

import {rightServiceManager} from '../service/RightServiceManager';
import {momentToISO, safeTrim} from '../../../util/Common';

export const rightSearchHelper = {

    loadAdvancedSearchForm: (filter) => {
        store.dispatch(searchFormSetAdvancedSearchCriteria(filter));
    },

    prepareAdvancedSearchCall: (searchCriteria) => {
        const response = {};
        for (let key of Object.keys(searchCriteria) ) {
            const criteria = searchCriteria[key];
            if (criteria) {
                if (!(criteria instanceof Object)) {
                    response[key] = safeTrim(criteria);
                } else if (criteria.value || criteria.value === false) {
                    response[key] = safeTrim(criteria.value);
                } else if(criteria.options) {
                    response[key] = safeTrim(Array.from(new Set(criteria.options.map(({aliasValue, value}) => aliasValue || value))).join(','));
                } else{
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
        rightServiceManager.search(this.prepareAdvancedSearchCall(searchCriteria));
    },

    advancedSearch(searchCriteria) {
        rightServiceManager.search(this.prepareAdvancedSearchCall(searchCriteria));
    }

};