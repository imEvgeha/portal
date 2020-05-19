import {store} from '../../../../../index';
import {resultHistoryPageLoading, resultPageHistoryUpdate, searchFormSetHistorySearchCriteria} from '../../../stores/actions/avail/history';
import {historyService} from '../service/HistoryService';

const defaultPageSort = [{id: 'received', desc: true}];

export const historyServiceManager = {
    //called by other systems, saves search criteria and updates data in redux which acts as a trigger for other elements
    //for now just table listens for that
    search: (searchCriteria) => {
        store.dispatch(searchFormSetHistorySearchCriteria(searchCriteria));
        store.dispatch(resultHistoryPageLoading(true));
    },

    //called by the table either as result of other systems triggering the table (page 0) or scrolling the table (page > 0)
    doSearch: (page, pageSize, sortedParams) => {
        return historyServiceManager.callService(historyService.advancedSearch, page, pageSize, sortedParams || defaultPageSort);
    },

    //the actual call to the service (and further to server), generic interpretation of result and forward for detailed interpretation (by the table)
    callService: (searchFn, page, pageSize, sortedParams) => {
        return searchFn(store.getState().history.session.searchCriteria, page, pageSize, sortedParams)
            .then(response => {
                store.dispatch(resultHistoryPageLoading(false));
                store.dispatch(resultPageHistoryUpdate({
                    pages: 1,
                    records: response.data,
                    pageSize: response.data.length,
                    total: response.total
                }));
                return response;
            }
            ).catch((error) => {
                store.dispatch(resultHistoryPageLoading(false));
                console.warn('Unexpected error'); // eslint-disable-line
                console.error(error); // eslint-disable-line
            });
    }
};
