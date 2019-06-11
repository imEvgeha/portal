import store from '../../../stores/index';
import {resultPageLoading, resultPageUpdate, searchFormSetSearchCriteria, resultPageSetBulkExport} from '../../../stores/actions/avail/dashboard';
import {rightsService} from './RightsService';

export const rightServiceManager = {
    //called by other systems, saves search criteria and updates data in redux which acts as a trigger for other elements
    //for now just table listens for that
    search: (searchCriteria) => {
        store.dispatch(searchFormSetSearchCriteria(searchCriteria));
        store.dispatch(resultPageLoading(true));
    },

    //called by the table either as result of other systems triggering the table (page 0) or scrolling the table (page > 0)
    //this function is just a wrapper that decides which service function (and API as a result) to call depending on data in search criteria
    doSearch: (page, pageSize, sortedParams) => {
        if(page === 0){
            store.dispatch(resultPageSetBulkExport(false));
        }
        if(store.getState().dashboard.session.searchCriteria.text){
            return rightServiceManager.callService(rightsService.freeTextSearch, page, pageSize, sortedParams);
        }else{
            return rightServiceManager.callService(rightsService.advancedSearch, page, pageSize, sortedParams).then(response => {
                if(response) {
                    store.dispatch(resultPageSetBulkExport(true));
                }
                return response;
            });
        }
    },

    //the actual call to the service (and further to server), generic interpretation of result and forward for detailed interpretation (by the table)
    callService: (searchFn, page, pageSize, sortedParams) => {
        return searchFn(store.getState().dashboard.session.searchCriteria, page, pageSize, sortedParams)
            .then(response => {
                store.dispatch(resultPageLoading(false));
                if(page === 0){
                    store.dispatch(resultPageUpdate({
                        pages: 1,
                        avails: response.data.data,
                        pageSize: response.data.data.length,
                        total: response.data.total
                    }));
                }
                return response;
            }
            ).catch((error) => {
                store.dispatch(resultPageLoading(false));
                console.warn('Unexpected error');
                console.error(error);
            });
    }
};