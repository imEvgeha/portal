import {setSorting} from '@vubiquity-nexus/portal-utils/lib/utils';
import {
    READY_PENDING_VIEW,
    ERROR_VIEW,
    WITHDRAWN_VIEW,
    REMOVED_FROM_CATALOG_VIEW,
} from '../../saved-table-dropdown/constants';

export const applyPredefinedTableView = (gridApi, filter, columnApi) => {
    gridApi.setFilterModel(null);
    gridApi.destroyFilter('icon');
    gridApi.destroyFilter('icon_1');

    switch (filter) {
        case ERROR_VIEW: {
            const filterInstance = gridApi.getFilterInstance('status');
            filterInstance.setModel({
                filterType: 'set',
                values: ['Error'],
            });
            break;
        }
        case READY_PENDING_VIEW: {
            const filterInstance = gridApi.getFilterInstance('status');
            filterInstance.setModel({
                filterType: 'set',
                values: ['Pending', 'ReadyNew', 'Ready'],
            });
            break;
        }
        case WITHDRAWN_VIEW: {
            const filterInstance = gridApi.getFilterInstance('rightStatus');
            filterInstance.setModel({
                filterType: 'set',
                values: ['Withdrawn'],
            });
            break;
        }
        case REMOVED_FROM_CATALOG_VIEW: {
            gridApi.setFilterModel({
                updatedCatalogReceived: {
                    filterType: 'set',
                    values: ['true'],
                },
            });
            break;
        }
        default:
            break;
    }
    gridApi.onFilterChanged();
    setSorting({colId: 'updatedAt', sort: 'desc'}, columnApi);
    columnApi.resetColumnState();
};
