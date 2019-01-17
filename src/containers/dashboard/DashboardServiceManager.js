import store from '../../stores';
import {resultPageLoading, resultPageUpdate, searchFormSetSearchCriteria} from '../../actions/dashboard';
import {dashboardService} from './DashboardService';

export const dashboardServiceManager = {
    search: (searchCriteria) => {
        store.dispatch(searchFormSetSearchCriteria(searchCriteria));
        store.dispatch(resultPageLoading(true));
    },

    doSearch: (page, pageSize, sortedParams) => {
        if(store.getState().dashboard.session.searchCriteria.text){
            return dashboardServiceManager.callService(dashboardService.freeTextSearch, page, pageSize, sortedParams);
        }else{
            return dashboardServiceManager.callService(dashboardService.advancedSearch, page, pageSize, sortedParams);
        }
    },

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