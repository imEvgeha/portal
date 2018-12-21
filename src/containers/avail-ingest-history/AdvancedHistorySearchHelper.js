import moment from 'moment';
import store from '../../stores';
import {
    searchFormUpdateAdvancedHistorySearchCriteria,
    resultHistoryPageLoading,
    resultPageHistoryUpdate
} from '../../actions/history';
import config from 'react-global-configuration';
import {historyService} from './HistoryService';
import {momentToISO} from '../../util/Common';

const doSearch = (searchCriteria, searchFn) => {
    store.dispatch(resultHistoryPageLoading(true));
    searchFn(searchCriteria, 0, config.get('avails.page.size'), defaultPageSort)
    .then(response => {
        store.dispatch(resultHistoryPageLoading(false));
        console.warn(response);
        store.dispatch(resultPageHistoryUpdate({
            pages: 1,
            records: response.data.data,
            pageSize: response.data.data.length,
            total: response.data.total
        }));
        }
    ).catch((error) => {
        console.warn('Unexpected error');
        console.error(error);
    });
};

const defaultPageSort = [];

export const advancedHistorySearchHelper = {

    loadAdvancedHistorySearchForm: (filter) => {
        store.dispatch(searchFormUpdateAdvancedHistorySearchCriteria({
            startFrom: filter.startFrom ? moment(filter.startFrom) : null,
            startTo: filter.startTo ? moment(filter.startTo) : null,
            endFrom: filter.endFrom ? moment(filter.endFrom) : null,
            endTo: filter.endTo ? moment(filter.endTo) : null,
            provider: filter.provider ? filter.provider : '',
            state: filter.state ? filter.state : null,
        }));
    },

    storeAdvancedHistorySearchForm: (searchCriteria) => {
        store.dispatch(searchFormUpdateAdvancedHistorySearchCriteria(searchCriteria));
    },

    prepareAdvancedHistorySearchCall: (searchCriteria) => {
        return {
            ...searchCriteria,
            startFrom: searchCriteria.startFrom && momentToISO(searchCriteria.startFrom),
            startTo: searchCriteria.startTo && momentToISO(searchCriteria.startTo),
            endFrom: searchCriteria.endFrom && momentToISO(searchCriteria.endFrom),
            endTo: searchCriteria.endTo && momentToISO(searchCriteria.endTo),
        };
    },

    clearAdvancedHistorySearchForm: () => {
        store.dispatch(searchFormUpdateAdvancedHistorySearchCriteria({
           startFrom: null,
           startTo: null,
           endFrom: null,
           endTo: null,
           provider: '',
           state: '',
        }));
    },

    advancedSearch(searchCriteria) {
        this.storeAdvancedHistorySearchForm(searchCriteria);
        doSearch(this.prepareAdvancedHistorySearchCall(searchCriteria), historyService.advancedSearch);
    },


};