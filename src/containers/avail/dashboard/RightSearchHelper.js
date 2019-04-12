import store from '../../../stores/index';
import {
    searchFormSetSearchCriteria,
    searchFormSetAdvancedSearchCriteria,
} from '../../../stores/actions/avail/dashboard';

import {rightServiceManager} from '../service/RightServiceManager';
import {safeTrim} from '../../../util/Common';
import moment from 'moment';
import RightsURL from '../util/RightsUtils';

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

    clearAdvancedSearchForm: () => {
        RightsURL.saveRightsSimpleFilterUrl({});
        store.dispatch(searchFormSetAdvancedSearchCriteria({}));
        store.dispatch(searchFormSetSearchCriteria({}));
    },

    freeTextSearch(searchCriteria) {
        RightsURL.saveRightsSimpleFilterUrl(searchCriteria);
        rightServiceManager.search(this.prepareAdvancedSearchCall(searchCriteria));
    },

    advancedSearch(searchCriteria) {
        RightsURL.saveRightsAdvancedFilterUrl(searchCriteria);
        rightServiceManager.search(this.prepareAdvancedSearchCall(searchCriteria));
    }

};