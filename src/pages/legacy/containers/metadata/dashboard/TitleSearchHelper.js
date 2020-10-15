import {store} from '../../../../../index';
import {searchFormSetSearchCriteria, searchFormSetAdvancedSearchCriteria} from '../../../stores/actions/metadata/index';

import {titleServiceManager} from '../service/TitleServiceManager';
import {momentToISO} from '../../../../../util/Common';

export const titleSearchHelper = {
    loadAdvancedSearchForm: filter => {
        store.dispatch(searchFormSetAdvancedSearchCriteria(filter));
    },

    prepareAdvancedSearchCall: searchCriteria => {
        const response = {};
        for (const key of Object.keys(searchCriteria)) {
            const criteria = searchCriteria[key];
            if (criteria) {
                if (!(criteria instanceof Object) && typeof criteria === 'string') {
                    response[key] = criteria.trim();
                } else if (criteria.value && typeof criteria.value === 'string') {
                    response[key] = criteria.value.trim();
                } else if (typeof criteria === 'boolean') {
                    response[key] = criteria;
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
        titleServiceManager.search(this.prepareAdvancedSearchCall(searchCriteria));
    },

    advancedSearch(searchCriteria) {
        titleServiceManager.search(this.prepareAdvancedSearchCall(searchCriteria));
    },
};
