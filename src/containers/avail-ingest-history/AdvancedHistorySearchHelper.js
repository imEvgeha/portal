import store from '../../stores';
import {
    searchFormSetAdvancedHistorySearchCriteria,
    searchFormSetHistorySearchCriteria,
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

    storeAdvancedHistorySearchForm: (searchCriteria) => {
        store.dispatch(searchFormSetHistorySearchCriteria(searchCriteria));
    },

    prepareAdvancedHistorySearchCall: (searchCriteria) => {
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

    clearAdvancedHistorySearchForm: () => {
        store.dispatch(searchFormSetAdvancedHistorySearchCriteria({
           received: null,
           provider: '',
           status: '',
        }));
        store.dispatch(searchFormSetHistorySearchCriteria({
           received: null,
           provider: '',
           status: '',
        }));
    },

    advancedSearch(searchCriteria) {
        this.storeAdvancedHistorySearchForm(searchCriteria);
        doSearch(this.prepareAdvancedHistorySearchCall(searchCriteria), historyService.advancedSearch);
    },


};