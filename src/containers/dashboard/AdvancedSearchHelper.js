import store from '../../stores';
import {
    resultPageSort,
    resultPageUpdate,
    resultPageLoading,
    searchFormSetSearchCriteria,
    searchFormSetAdvancedSearchCriteria,
} from '../../actions/dashboard';
import config from 'react-global-configuration';
import {dashboardService} from './DashboardService';
import {momentToISO} from '../../util/Common';

const doSearch = (searchCriteria, searchFn) => {
    store.dispatch(resultPageLoading(true));
    store.dispatch(resultPageSort(defaultPageSort));
    searchFn(searchCriteria, 0, config.get('avails.page.size'), defaultPageSort)
    .then(response => {
            store.dispatch(resultPageLoading(false));
            store.dispatch(resultPageUpdate({
                pages: 1,
                avails: response.data.data,
                pageSize: response.data.data.length,
                total: response.data.total
            }));
        }
    ).catch((error) => {
        store.dispatch(resultPageLoading(false));
        console.warn('Unexpected error');
        console.error(error);
    });
};

const defaultPageSort = [];

export const advancedSearchHelper = {

    loadAdvancedSearchForm: (filter) => {
        store.dispatch(searchFormSetAdvancedSearchCriteria(filter));
    },

    storeAdvancedSearchForm: (searchCriteria) => {
        store.dispatch(searchFormSetSearchCriteria(searchCriteria));
    },

    prepareAdvancedSearchCall: (searchCriteria) => {
        const response = {};
        for (let key of Object.keys(searchCriteria) ) {
            const criteria = searchCriteria[key];
            if (criteria) {
                if (!(criteria instanceof Object)) {
                    response[key] = criteria;
                } else if (criteria.value) {
                    response[key] = criteria.value;
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
        doSearch(this.prepareAdvancedSearchCall(searchCriteria), dashboardService.freeTextSearch);
    },

    advancedSearch(searchCriteria) {
        this.storeAdvancedSearchForm(searchCriteria);
        doSearch(this.prepareAdvancedSearchCall(searchCriteria), dashboardService.advancedSearch);
    }

};