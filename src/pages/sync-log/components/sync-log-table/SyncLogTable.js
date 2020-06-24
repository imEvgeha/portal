import React, {useState} from 'react';
import {compose} from 'redux';
import Button from '@atlaskit/button';
import {getSyncLog} from '../../syncLogService';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withColumnsResizing from '../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import createValueFormatter from '../../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import {GRID_EVENTS} from '../../../../ui/elements/nexus-grid/constants';
import columnMappings from '../../columnMappings.json';
import {DOWNLOAD_BTN, EXCEL_EXPORT_FILE_NAME} from '../../syncLogConstants';
import './SyncLogTable.scss';

const SyncLogGrid = compose(
    withColumnsResizing(),
    withInfiniteScrolling({fetchData: getSyncLog})
)(NexusGrid);

const SyncLogTable = () => {
    const [gridApi, setGridApi] = useState(null);

    const updateColumnDefs = (columnDefs) => {
        return columnDefs.map(columnDef => (
            {
                ...columnDef,
                valueFormatter: createValueFormatter(columnDef),
                cellRenderer: 'loadingCellRenderer',
            }
        ));
    };

    const onGridEvent = ({type, api}) => {
        const {READY} = GRID_EVENTS;
        switch(type) {
            case READY:
                setGridApi(api);
                break;
        }
    };

    return (
        <div className="nexus-c-sync-log-table">
            <div className="nexus-c-sync-log-table__actions">
                <Button
                    onClick={() => gridApi.exportDataAsExcel({fileName: EXCEL_EXPORT_FILE_NAME})}
                    isDisabled={!gridApi}
                >
                    {DOWNLOAD_BTN}
                </Button>
            </div>
            <SyncLogGrid
                className="nexus-c-sync-log-grid"
                columnDefs={updateColumnDefs(columnMappings)}
                mapping={columnMappings}
                rowSelection="single"
                onGridEvent={onGridEvent}
            />
        </div>
    );
};

export default SyncLogTable;
