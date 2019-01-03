import moment from 'moment';
import store from '../../stores';
import {
    searchFormUpdateAdvancedHistorySearchCriteria,
    searchFormUpdateHistorySearchCriteria,
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
            receivedFrom: filter.receivedFrom ? moment(filter.receivedFrom) : null,
            receivedTo: filter.receivedTo ? moment(filter.receivedTo) : null,
            provider: filter.provider ? filter.provider : '',
            state: filter.state ? filter.state : null,
        }));
    },

    storeAdvancedHistorySearchForm: (searchCriteria) => {
        store.dispatch(searchFormUpdateHistorySearchCriteria(searchCriteria));
    },

    prepareAdvancedHistorySearchCall: (searchCriteria) => {
        return {
            ...searchCriteria,
            receivedFrom: searchCriteria.receivedFrom && momentToISO(searchCriteria.receivedFrom),
            receivedTo: searchCriteria.receivedTo && momentToISO(searchCriteria.receivedTo),
        };
    },

    clearAdvancedHistorySearchForm: () => {
        store.dispatch(searchFormUpdateAdvancedHistorySearchCriteria({
           receivedFrom: null,
           receivedTo: null,
           provider: '',
           state: '',
        }));
        store.dispatch(searchFormUpdateHistorySearchCriteria({
           receivedFrom: null,
           receivedTo: null,
           provider: '',
           state: '',
        }));
    },

    advancedSearch(searchCriteria) {
        this.storeAdvancedHistorySearchForm(searchCriteria);
        doSearch(this.prepareAdvancedHistorySearchCall(searchCriteria), historyService.advancedSearch);
    },


};