import React, {useState, useEffect} from 'react';
import {compose} from 'redux';
import Button from '@atlaskit/button';
import {getSyncLog} from '../../syncLogService';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
import NexusDatePicker from '../../../../ui/elements/nexus-date-and-time-elements/nexus-date-picker/NexusDatePicker';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withColumnsResizing from '../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import createValueFormatter from '../../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import {dateToISO} from '../../../../util/date-time/DateTimeUtils';
import {DATETIME_FIELDS} from '../../../../util/date-time/constants';
import {GRID_EVENTS} from '../../../../ui/elements/nexus-grid/constants';
import columnMappings from '../../columnMappings.json';
import {DOWNLOAD_BTN, EXCEL_EXPORT_FILE_NAME} from '../../syncLogConstants';
import './SyncLogTable.scss';

const SyncLogGrid = compose(
    withColumnsResizing(),
    withInfiniteScrolling({fetchData: getSyncLog}),
)(NexusGrid);

const SyncLogTable = () => {
    const [gridApi, setGridApi] = useState(null);
    const [dateFrom, setDateFrom] = useState(dateToISO(new Date(), DATETIME_FIELDS.REGIONAL_MIDNIGHT));
    const [dateTo, setDateTo] = useState('');

    const updateColumnDefs = (columnDefs) => {
        return columnDefs.map(columnDef => ({
            ...columnDef,
            valueFormatter: createValueFormatter(columnDef),
            ...(columnDef.field === 'publishErrors' && {
                valueGetter: ({data}) => data && data.publishErrors.map(e => e.description).join('; ')
            }),
            ...(columnDef.field === 'status' && {
                valueGetter: ({data}) => data && data.publishErrors.length ? 'Error' : 'Success'
            }),
            cellRenderer: 'loadingCellRenderer',
        }));
    };

    const onGridEvent = ({type, api}) => {
        const {READY} = GRID_EVENTS;
        switch (type) {
            case READY:
                api.sizeColumnsToFit();
                setGridApi(api);
                break;
        }
    };

    return (
        <div className="nexus-c-sync-log-table">
            <div className="nexus-c-sync-log-table__actions">
                <div />
                <div className="nexus-c-sync-log-table__date-filter">
                    <div className="nexus-c-sync-log-table__date-field">
                        <NexusDatePicker
                            id="dateFrom"
                            label="Date From"
                            onChange={setDateFrom}
                            value={dateFrom}
                            isReturningTime={false}
                            required
                        />
                    </div>
                    <div className="nexus-c-sync-log-table__date-field">
                        <NexusDatePicker
                            id="dateTo"
                            label="Date To"
                            onChange={setDateTo}
                            value={dateTo}
                            isReturningTime={false}
                        />
                    </div>
                </div>
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
                externalFilter={{
                    dateFrom,
                    dateTo
                }}
            />
        </div>
    );
};

export default SyncLogTable;
