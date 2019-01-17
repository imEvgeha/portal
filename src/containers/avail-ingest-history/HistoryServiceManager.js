import store from '../../stores';
import {resultHistoryPageLoading, resultPageHistoryUpdate, searchFormSetHistorySearchCriteria} from '../../actions/history';
import {historyService} from './HistoryService';

export const historyServiceManager = {
    search: (searchCriteria) => {
        store.dispatch(searchFormSetHistorySearchCriteria(searchCriteria));
        store.dispatch(resultHistoryPageLoading(true));
    },

    doSearch: (page, pageSize, sortedParams) => {
        return historyServiceManager.callService(historyService.advancedSearch, page, pageSize, sortedParams);
    },

    callService: (searchFn, page, pageSize, sortedParams) => {
        return searchFn(store.getState().history.session.searchCriteria, page, pageSize, sortedParams)
            .then(response => {
                store.dispatch(resultHistoryPageLoading(false));
                store.dispatch(resultPageHistoryUpdate({
                    pages: 1,
                    records: response.data.data,
                    pageSize: response.data.data.length,
                    total: response.data.total
                }));
                return response;
            }
            ).catch((error) => {
                store.dispatch(resultHistoryPageLoading(false));
                console.warn('Unexpected error');
                console.error(error);
            });
    }
};