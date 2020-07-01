import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import {connect} from 'react-redux';
import Button from '@atlaskit/button';
import {getEventSearch} from '../../eventManagementService';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../../ui/elements/nexus-grid/hoc/withSideBar';
import withSorting from '../../../../ui/elements/nexus-grid/hoc/withSorting';
import withColumnsResizing from '../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '../../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import createValueFormatter from '../../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import {toggleRefreshGridData} from '../../../../ui/grid/gridActions';
import columnDefs from '../../columnMappings.json';
import {INITIAL_SORT, NOT_FILTERABLE_FIELDS, REFRESH_BTN} from '../../eventManagementConstants';
import './EventManagementTable.scss';

const EventManagementGrid = compose(
    withSideBar(),
    withColumnsResizing(),
    withSorting(INITIAL_SORT),
    withFilterableColumns({useDatesWithTime:true}),
    withInfiniteScrolling({fetchData: getEventSearch})
)(NexusGrid);

const EventManagementTable = ({onGridEvent, toggleRefreshGridData}) => {
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
        <div className="nexus-c-event-management-table">
            <Button
                className="nexus-c-event-management-table__refresh-button"
                onClick={() => toggleRefreshGridData(true)}
            >
                {REFRESH_BTN}
            </Button>
            <EventManagementGrid
                className="nexus-c-event-management-grid"
                columnDefs={updateColumnDefs(columnDefs)}
                rowSelection="single"
                onGridEvent={onGridEvent}
                mapping={columnDefs}
                notFilterableColumns={NOT_FILTERABLE_FIELDS}
            />
        </div>
    );
};

EventManagementTable.propTypes = {
    onGridEvent: PropTypes.func,
    toggleRefreshGridData: PropTypes.func.isRequired,
};

EventManagementTable.defaultProps = {
    onGridEvent: () => null,
};

const mapDispatchToProps = dispatch => ({
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
});

export default connect(null, mapDispatchToProps)(EventManagementTable);
