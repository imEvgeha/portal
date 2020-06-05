import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import {getEventSearch} from '../../eventManagementService';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../../ui/elements/nexus-grid/hoc/withSideBar';
import withSorting from '../../../../ui/elements/nexus-grid/hoc/withSorting';
import withColumnsResizing from '../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '../../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import createValueFormatter from '../../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import columnDefs from '../../columnMappings.json';
import {INITIAL_SORT} from '../../eventManagementConstants';

const EventManagementGrid = compose(
    withSideBar(),
    withColumnsResizing(),
    withSorting(INITIAL_SORT),
    withFilterableColumns(),
    withInfiniteScrolling({fetchData: getEventSearch})
)(NexusGrid);

const EventManagementTable = ({onGridEvent}) => {
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
            rowSelection="single"
            onGridEvent={onGridEvent}
            mapping={columnDefs}
        />
    );
};

EventManagementTable.defaultProps = {
    onGridEvent: PropTypes.func,
};

EventManagementTable.propTypes = {
    onGridEvent: () => null,
};

export default EventManagementTable;
