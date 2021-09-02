import {store} from '../../../../../index';
import {
    resultPageLoading,
    searchFormSetSearchCriteria,
    resultPageSetBulkExport,
} from '../../../stores/actions/avail/dashboard';
import {rightsService} from './RightsService';

export const rightServiceManager = {
    //called by other systems, saves search criteria and updates data in redux which acts as a trigger for other elements
    //for now just table listens for that
    search: searchCriteria => {
        store.dispatch(searchFormSetSearchCriteria(searchCriteria));
        store.dispatch(resultPageLoading(true));
    },

    callPlanningSearch: (criteria, page, pageSize, sortedParams) => {
        return rightsService
            .advancedSearch(criteria, page, pageSize, sortedParams)
            .then(response => {
                return response;
            })
            .catch(error => {
                store.dispatch(resultPageLoading(false));
                // eslint-disable-next-line
                console.warn('unexpected error');
                // eslint-disable-next-line
                console.error(error);
            });
    },
};
