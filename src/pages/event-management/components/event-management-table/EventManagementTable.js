import React, {useState, useEffect}  from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import {isNumber} from 'lodash';
import Button from '@atlaskit/button';
import {getEventSearch} from '../../eventManagementService';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../../ui/elements/nexus-grid/hoc/withSideBar';
import withSorting from '../../../../ui/elements/nexus-grid/hoc/withSorting';
import withColumnsResizing from '../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import withFilterableColumns from '../../../../ui/elements/nexus-grid/hoc/withFilterableColumns';
import createValueFormatter from '../../../../ui/elements/nexus-grid/elements/value-formatter/createValueFormatter';
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

const EventManagementTable = ({onGridEvent}) => {
    const [pageNumber, setPageNumber] =  useState(null);

    const successDataFetchCallback = () => {
        if(isNumber(pageNumber)) {
            setPageNumber(null);
        }
    };

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
        <div className={'nexus-c-event-management-table'}>
            <Button
                onClick={() => setPageNumber(0)}
            >
                {REFRESH_BTN}
            </Button>
            <EventManagementGrid
                columnDefs={updateColumnDefs(columnDefs)}
                rowSelection="single"
                onGridEvent={onGridEvent}
                mapping={columnDefs}
                notFilterableColumns={NOT_FILTERABLE_FIELDS}
                params={{pageNumber: pageNumber}}
                successDataFetchCallback={successDataFetchCallback}
            />
        </div>
    );
};

EventManagementTable.defaultProps = {
    onGridEvent: PropTypes.func,
};

EventManagementTable.propTypes = {
    onGridEvent: () => null,
};

export default EventManagementTable;
