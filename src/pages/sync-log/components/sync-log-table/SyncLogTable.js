import React from 'react';
import {compose} from 'redux';
import Button from '@atlaskit/button';
import {getSyncLog} from '../../syncLogService';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withColumnsResizing from '../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import createValueFormatter from '../../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import columnMappings from '../../columnMappings.json';
import {DOWNLOAD_BTN} from '../../syncLogConstants';
import './SyncLogTable.scss';

const SyncLogGrid = compose(
    withColumnsResizing(),
    withInfiniteScrolling({fetchData: getSyncLog})
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
            <div className="nexus-c-sync-log-table__actions">
                <Button
                    onClick={() => {/* XML Download action */}}
                >
                    {DOWNLOAD_BTN}
                </Button>
            </div>
            <SyncLogGrid
                className="nexus-c-sync-log-grid"
                columnDefs={updateColumnDefs(columnMappings)}
                mapping={columnMappings}
                rowSelection="single"
            />
        </div>
    );
};

export default SyncLogTable;
