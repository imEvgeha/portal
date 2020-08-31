import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {connect} from 'react-redux';
import {compose} from 'redux';
import DateTimeRenderer from '../../../../ui/elements/nexus-date-time-context/NexusDateTimeRenderer';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
import createValueFormatter from '../../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
import withColumnsResizing from '../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '../../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../../ui/elements/nexus-grid/hoc/withSideBar';
import withSorting from '../../../../ui/elements/nexus-grid/hoc/withSorting';
import {toggleRefreshGridData} from '../../../../ui/grid/gridActions';
import {DATETIME_FIELDS} from '../../../../util/date-time/constants';
import columnDefs from '../../columnMappings.json';
import {NOT_FILTERABLE_FIELDS, REFRESH_BTN} from '../../eventManagementConstants';
import {getEventSearch} from '../../eventManagementService';
import './EventManagementTable.scss';

const EventManagementGrid = compose(
    withSideBar(),
    withColumnsResizing(),
    withSorting(),
    withFilterableColumns({useDatesWithTime: true}),
    withInfiniteScrolling({fetchData: getEventSearch})
)(NexusGrid);

const EventManagementTable = ({gridApi, onGridEvent, toggleRefreshGridData, ...props}) => {
    const updateColumnDefs = columnDefs => {
        return columnDefs.map(columnDef => {
            const defaultColDef = {
                ...columnDef,
                valueFormatter: createValueFormatter(columnDef),
                cellRenderer: 'loadingCellRenderer',
            };
            if (
                [
                    DATETIME_FIELDS.TIMESTAMP,
                    DATETIME_FIELDS.BUSINESS_DATETIME,
                    DATETIME_FIELDS.REGIONAL_MIDNIGHT,
                ].includes(columnDef.dataType)
            ) {
                return {
                    ...defaultColDef,
                    cellRenderer: null,
                    cellRendererFramework: params => {
                        return <DateTimeRenderer value={params.value}>{value => <p>{value}</p>}</DateTimeRenderer>;
                    },
                };
            }
            return defaultColDef;
        });
    };

    return (
        <div className="nexus-c-event-management-table">
            <div className="nexus-c-event-management-table__refresh-button">
                <Button onClick={() => toggleRefreshGridData(true)}>{REFRESH_BTN}</Button>
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
    gridApi: PropTypes.object,
    onGridEvent: PropTypes.func,
    toggleRefreshGridData: PropTypes.func.isRequired,
};

EventManagementTable.defaultProps = {
    gridApi: {},
    onGridEvent: () => null,
};

const mapDispatchToProps = dispatch => ({
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
});

export default connect(null, mapDispatchToProps)(EventManagementTable);
