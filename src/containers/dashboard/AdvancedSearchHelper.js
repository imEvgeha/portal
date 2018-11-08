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

    //TODO: Support mapping
    loadAdvancedSearchForm: (filter) => {
        store.dispatch(searchFormUpdateAdvancedSearchCriteria({
            vodStartFrom: filter.vodStartFrom ? moment(filter.vodStartFrom) : null,
            vodStartTo: filter.vodStartTo ? moment(filter.vodStartTo) : null,
            vodEndFrom: filter.vodEndFrom ? moment(filter.vodEndFrom) : null,
            vodEndTo: filter.vodEndTo ? moment(filter.vodEndTo) : null,
            estStartFrom: filter.estStartFrom ? moment(filter.estStartFrom) : null,
            estStartTo: filter.estStartTo ? moment(filter.estStartTo) : null,
            estEndFrom: filter.estEndFrom ? moment(filter.estEndFrom) : null,
            estEndTo: filter.estEndTo ? moment(filter.estEndTo) : null,
            title: filter.title ? filter.title : '',
            studio: filter.studio ? filter.studio : '',
            releaseYear: filter.releaseYear ? filter.releaseYear : '',
            releaseType: filter.releaseType ? filter.releaseType : '',
            licensor: filter.licensor ? filter.licensor : '',
            territory: filter.territory ? filter.territory : '',
            rowInvalid: filter.rowInvalid ? filter.rowInvalid : false,
        }));
    },

    storeAdvancedSearchForm: (searchCriteria) => {
        store.dispatch(searchFormUpdateSearchCriteria(searchCriteria));
    },

    prepareAdvancedSearchCall: (searchCriteria) => {
        return {
            ...searchCriteria,
            vodStartFrom: searchCriteria.vodStartFrom && searchCriteria.vodStartFrom.toISOString(),
            vodStartTo: searchCriteria.vodStartTo && searchCriteria.vodStartTo.toISOString()
        };
    },

    clearAdvancedSearchForm: () => {
        console.log('CLEAR');
        store.dispatch(searchFormUpdateAdvancedSearchCriteria({
            vodStartFrom: null,
            vodStartTo: null,
            vodEndFrom: null,
            vodEndTo: null,
            estStartFrom: null,
            estStartTo: null,
            estEndFrom: null,
            estEndTo: null,
            rowInvalid: false,
            title: '',
            studio: '',
            releaseYear: '',
            releaseType: '',
            licensor: '',
            territory: '',
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