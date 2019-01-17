import store from '../../stores';
import {
    resultPageSort,
    resultPageUpdate,
    resultPageLoading,
    searchFormSetSearchCriteria,
    searchFormSetAdvancedSearchCriteria,
} from '../../actions/dashboard';
import config from 'react-global-configuration';
import {dashboardServiceManager} from './DashboardServiceManager';
import {momentToISO} from '../../util/Common';

const defaultPageSort = [];

export const advancedSearchHelper = {

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
        store.dispatch(searchFormSetAdvancedSearchCriteria({
            rowInvalid: {value: false},
        }));
        store.dispatch(searchFormSetSearchCriteria({
            rowInvalid: {value: false},
        }));
    },

    freeTextSearch(searchCriteria) {
        dashboardServiceManager.search(this.prepareAdvancedSearchCall(searchCriteria));
    },

    advancedSearch(searchCriteria) {
        dashboardServiceManager.search(this.prepareAdvancedSearchCall(searchCriteria));
    }

};