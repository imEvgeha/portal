import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import {connect} from 'react-redux';
import {compose} from 'redux';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
import createValueFormatter from '../../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import withColumnsResizing from '../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '../../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../../ui/elements/nexus-grid/hoc/withSideBar';
import withSorting from '../../../../ui/elements/nexus-grid/hoc/withSorting';
import {toggleRefreshGridData} from '../../../../ui/grid/gridActions';
import columnDefs from '../../columnMappings.json';
import {NOT_FILTERABLE_FIELDS, REFRESH_BTN, CLEAR_FILTERS_BTN} from '../../eventManagementConstants';
import {getEventSearch} from '../../eventManagementService';
import './EventManagementTable.scss';

const EventManagementGrid = compose(
    withSideBar(),
    withColumnsResizing(),
    withSorting(),
    withFilterableColumns({useDatesWithTime: true}),
    withInfiniteScrolling({fetchData: getEventSearch})
)(NexusGrid);

const EventManagementTable = ({toggleRefreshGridData, clearFilters, ...props}) => {
    const updateColumnDefs = columnDefs => {
        return columnDefs.map(columnDef => ({
            ...columnDef,
            valueFormatter: createValueFormatter(columnDef),
            cellRenderer: 'loadingCellRenderer',
        }));
    };

    return (
        <div className="nexus-c-event-management-table">
            <div className="nexus-c-event-management-table__toolbar">
                <Tooltip content="Clear Active Column Filters">
                    <Button className="nexus-c-event-management-table__toolbar-button" onClick={clearFilters}>
                        {CLEAR_FILTERS_BTN}
                    </Button>
                </Tooltip>
                <Tooltip content="Refresh Grid Data">
                    <Button
                        className="nexus-c-event-management-table__toolbar-button"
                        onClick={() => toggleRefreshGridData(true)}
                    >
                        {REFRESH_BTN}
                    </Button>
                </Tooltip>
            </div>
            <EventManagementGrid
                className="nexus-c-event-management-grid"
                columnDefs={updateColumnDefs(columnDefs)}
                rowSelection="single"
                mapping={columnDefs}
                notFilterableColumns={NOT_FILTERABLE_FIELDS}
                {...props}
            />
        </div>
    );
};

EventManagementTable.propTypes = {
    toggleRefreshGridData: PropTypes.func.isRequired,
    clearFilters: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
});

export default connect(null, mapDispatchToProps)(EventManagementTable);
