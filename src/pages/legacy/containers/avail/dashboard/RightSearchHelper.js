import {store} from '../../../../../index';
import {
    searchFormSetSearchCriteria,
    searchFormSetAdvancedSearchCriteria,
} from '../../../stores/actions/avail/dashboard';

import {rightServiceManager} from '../service/RightServiceManager';
import {safeTrim} from '@vubiquity-nexus/portal-utils/lib/Common';
import RightsURL from '../util/RightsURL';

export const rightSearchHelper = {
    loadAdvancedSearchForm: filter => {
        store.dispatch(searchFormSetAdvancedSearchCriteria(filter));
    },

    prepareAdvancedSearchCall: searchCriteria => {
        const response = {};
        for (const key of Object.keys(searchCriteria)) {
            const criteria = searchCriteria[key];
            if (criteria) {
                if (!(criteria instanceof Object)) {
                    response[key] = safeTrim(criteria);
                } else if (criteria.value || criteria.value === false) {
                    response[key] = safeTrim(criteria.value);
                } else if (criteria.options) {
                    response[key] = safeTrim(
                        Array.from(new Set(criteria.options.map(({aliasValue, value}) => aliasValue || value))).join(
                            ','
                        )
                    );
                } else {
                    if (criteria.from) {
                        response[key + 'From'] = criteria.from;
                    }
                    if (criteria.to) {
                        response[key + 'To'] = criteria.to;
                    }
                }
            }
        }
        return response;
    },

    clearAdvancedSearchForm: () => {
        RightsURL.saveRightsSimpleFilterUrl({});
        store.dispatch(searchFormSetAdvancedSearchCriteria({}));
        store.dispatch(searchFormSetSearchCriteria({}));
    },

    freeTextSearch(searchCriteria, toURL = true) {
        if (toURL) {
            RightsURL.saveRightsSimpleFilterUrl(searchCriteria);
        }
        rightServiceManager.search(this.prepareAdvancedSearchCall(searchCriteria));
    },

    advancedSearch(searchCriteria, toURL = true) {
        if (toURL) {
            RightsURL.saveRightsAdvancedFilterUrl(searchCriteria);
        }
        rightServiceManager.search(this.prepareAdvancedSearchCall(searchCriteria));
    },
};
