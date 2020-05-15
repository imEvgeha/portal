import React from 'react';
import {compose} from 'redux';
import {getEventSearch} from '../../eventManagementService';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../../ui/elements/nexus-grid/hoc/withSideBar';
import withSorting from '../../../../ui/elements/nexus-grid/hoc/withSorting';
import withFilterableColumns from '../../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import createValueFormatter from '../../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import columnDefs from '../../columnMappings.json';

const EventManagementGrid = compose(
    withSideBar(),
    withSorting(),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: getEventSearch})
)(NexusGrid);

const EventManagementTable = () => {
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
        <EventManagementGrid
            columnDefs={updateColumnDefs(columnDefs)}
            mapping={columnDefs}
        />
    );
};

export default EventManagementTable;
