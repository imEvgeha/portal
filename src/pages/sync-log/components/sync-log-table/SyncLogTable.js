import React from 'react';
import {compose} from 'redux';
import Button from '@atlaskit/button';
// import {getSyncLog} from '../../syncLogService';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
// import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSorting from '../../../../ui/elements/nexus-grid/hoc/withSorting';
import withColumnsResizing from '../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import createValueFormatter from '../../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import columnDefs from '../../columnMappings.json';
import {INITIAL_SORT, DOWNLOAD_BTN} from '../../syncLogConstants';
import './SyncLogTable.scss';

const SyncLogGrid = compose(
    withColumnsResizing(),
    withSorting(INITIAL_SORT),
    // withInfiniteScrolling({fetchData: getSyncLog})
)(NexusGrid);

const SyncLogTable = () => {
    const updateColumnDefs = (columnDefs) => {
        return columnDefs.map(columnDef => (
            {
                ...columnDef,
                valueFormatter: createValueFormatter(columnDef),
                cellRenderer: 'loadingCellRenderer',
            }
        ));
    };

    return (
        <div className="nexus-c-sync-log-table">
            <Button
                className="nexus-c-sync-log-table__download-button"
                onClick={() => {/* XML Download action */}}
            >
                {DOWNLOAD_BTN}
            </Button>
            <SyncLogGrid
                className="nexus-c-sync-log-grid"
                columnDefs={updateColumnDefs(columnDefs)}
                rowSelection="single"
                mapping={columnDefs}
            />
        </div>
    );
};

export default SyncLogTable;
