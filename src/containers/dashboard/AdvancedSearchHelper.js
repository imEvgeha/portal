import moment from 'moment';
import store from '../../stores';
import {
    resultPageSort,
    resultPageUpdate,
    resultPageLoading,
    searchFormUpdateSearchCriteria,
    searchFormUpdateAdvancedSearchCriteria,
} from '../../actions/dashboard';
import config from 'react-global-configuration';
import {dashboardService} from './DashboardService';

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
        console.log('Unexpected error');
        console.error(error);
    });
};

const defaultPageSort = [];

export const advancedSearchHelper = {

    loadAdvancedSearchForm: (filter) => {
        store.dispatch(searchFormUpdateAdvancedSearchCriteria({
            vodStartFrom: filter.vodStartFrom ? moment(filter.vodStartFrom) : null,
            vodStartTo: filter.vodStartTo ? moment(filter.vodStartTo) : null,
            vodEndFrom: filter.vodEndFrom ? moment(filter.vodEndFrom) : null,
            vodEndTo: filter.vodEndTo ? moment(filter.vodEndTo) : null,
            studio: filter.studio ? filter.studio : '',
            title: filter.title ? filter.title : '',
        }));
    },

    storeAdvancedSearchForm: (searchCriteria) => {
        store.dispatch(searchFormUpdateSearchCriteria(searchCriteria));
    },

    prepareAdvancedSearchCall: (searchCriteria) => {
        return {
            ...searchCriteria,
            vodStart: searchCriteria.vodStart && searchCriteria.vodStart.toISOString(),
            vodEnd: searchCriteria.vodEnd && searchCriteria.vodEnd.toISOString()
        };
    },

    clearAdvancedSearchForm: () => {
        console.log('CLEAR');
        console.log(store.getState().dashboard.advancedSearchCriteria);
        store.dispatch(searchFormUpdateAdvancedSearchCriteria({
            vodStartFrom: null,
            vodStartTo: null,
            vodEndFrom: null,
            vodEndTo: null,
            studio: '',
            title: '',
        }));
        console.log(store.getState().dashboard.advancedSearchCriteria);
    },

    freeTextSearch(searchCriteria) {
        doSearch(this.prepareAdvancedSearchCall(searchCriteria), dashboardService.freeTextSearch);
    },

    advancedSearch(searchCriteria) {
        this.storeAdvancedSearchForm(searchCriteria);
        doSearch(this.prepareAdvancedSearchCall(searchCriteria), dashboardService.advancedSearch);
    },


};