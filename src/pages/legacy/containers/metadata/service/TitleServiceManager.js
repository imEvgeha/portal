import {EXCLUDED_INITIAL_FILTER_VALUES} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/constants';
import {isEmpty} from 'lodash';
import {store} from '../../../../../index';
import {resultPageLoading, resultPageUpdate, searchFormSetSearchCriteria} from '../../../stores/actions/metadata/index';
import {titleService} from './TitleService';

export const titleServiceManager = {
    //called by other systems, saves search criteria and updates data in redux which acts as a trigger for other elements
    //for now just table listens for that
    search: searchCriteria => {
        store.dispatch(searchFormSetSearchCriteria(searchCriteria));
        store.dispatch(resultPageLoading(true));
    },

    //called by the table either as result of other systems triggering the table (page 0) or scrolling the table (page > 0)
    //this function is just a wrapper that decides which service function (and API as a result) to call depending on data in search criteria
    doSearch: (page, pageSize, sortedParams) => {
        let storeTitleReducer = store.getState().titleReducer;
        if (
            storeTitleReducer.freeTextSearch.title || storeTitleReducer.freeTextSearch.seriesName ||
            storeTitleReducer.session.searchCriteria.parentId
        ) {
            return titleServiceManager.callService(titleService.freeTextSearch, page, pageSize, sortedParams);
        } else {
            return titleServiceManager.callService(titleService.advancedSearch, page, pageSize, sortedParams);
        }
    },

    // Temporary solution - pick between 2 title APIs for fetching titles
    smartSearch: (searchCriteria, page, pageSize, sortedParams) => {
        const isSeachCriteriaEmpty =
            isEmpty(searchCriteria) ||
            Object.values(searchCriteria).every(v => EXCLUDED_INITIAL_FILTER_VALUES.includes(v));
        if (isSeachCriteriaEmpty) {
            return titleService.advancedSearch(searchCriteria, page, pageSize, sortedParams);
        }
        // metadata titles/search API expects 'AD' as content type,
        // avails API expects 'Advertisement' as content type
        if (searchCriteria.contentType && searchCriteria.contentType.toLowerCase() === 'advertisement') {
            searchCriteria.contentType = 'Ad';
        }
        return titleService.freeTextSearch(searchCriteria, page, pageSize, sortedParams);
    },

    //the actual call to the service (and further to server), generic interpretation of result and forward for detailed interpretation (by the table)
    callService: (searchFn, page, pageSize, sortedParams) => {
        return searchFn(store.getState().titleReducer.session.searchCriteria, page, pageSize, sortedParams)
            .then(response => {
                store.dispatch(resultPageLoading(false));
                if (page === 0) {
                    store.dispatch(
                        resultPageUpdate({
                            pages: 1,
                            titles: response?.data,
                            pageSize: response?.data?.length,
                            total: response?.total,
                        })
                    );
                }
                return response;
            })
            .catch(error => {
                store.dispatch(resultPageLoading(false));
                // eslint-disable-next-line
                console.warn('Unexpected error');
                // eslint-disable-next-line
                console.error(error);
            });
    },
};
