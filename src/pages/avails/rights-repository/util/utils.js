import React from 'react';
import {setSorting} from '@vubiquity-nexus/portal-utils/lib/utils';
import {cloneDeep} from 'lodash';
import {NexusTooltip} from '../../../../ui/elements';
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

export const mapColumnDefinitions = columnDefs =>
    columnDefs.map(columnDef => {
        let updatedColumnDef = {...columnDef};

        if (columnDef.colId === 'displayName') {
            updatedColumnDef = {
                ...updatedColumnDef,
                cellRendererFramework: params => {
                    const {valueFormatted} = params || {};
                    const value = valueFormatted ? ' '.concat(valueFormatted.split(';').join('\n')) : '';
                    return (
                        <div className="nexus-c-rights-repo-table__cast-crew">
                            <NexusTooltip content={value}>
                                <div>{valueFormatted || ''}</div>
                            </NexusTooltip>
                        </div>
                    );
                },
            };
        }
        return updatedColumnDef;
    });

export const commonDragStoppedHandler = (event, tableColumnDefinitions, mapping) => {
    const updatedMappings = tableColumnDefinitions.length ? cloneDeep(tableColumnDefinitions) : cloneDeep(mapping);
    const columnHeader = event.target.textContent.trim();
    const columns = event.columnApi?.columnModel?.getAllGridColumns();

    const moveTo = columns.findIndex(col => col.colDef.headerName === columnHeader);
    const moveFrom = updatedMappings.findIndex(col => col.headerName === columnHeader);
    const [movedColumn] = updatedMappings.splice(moveFrom, 1);
    updatedMappings.splice(moveTo, 0, movedColumn);
    return updatedMappings;
};
