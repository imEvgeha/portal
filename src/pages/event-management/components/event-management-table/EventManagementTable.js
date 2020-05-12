import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import NexusGrid from '../../../../ui/elements/nexus-grid/NexusGrid';
import withInfiniteScrolling from '../../../../ui/elements/nexus-grid/hoc/withInfiniteScrolling';
import withSideBar from '../../../../ui/elements/nexus-grid/hoc/withSideBar';
import {getEventSearch} from '../../eventManagmentService'; 
import columnDefs from '../../columnMappings.json';

const EventManagementGrid = compose(
    withSideBar(),
    withInfiniteScrolling({fetchData: getEventSearch})
)(NexusGrid);

const EventManagementTable = ({onGridEvent}) => (
    <EventManagementGrid
        columnDefs={columnDefs}
        rowSelection='single'
        onGridEvent={onGridEvent}
    />
);

EventManagementTable.defaultProps = {
    onGridEvent: PropTypes.func,
};

EventManagementTable.propTypes = {
    onGridEvent: () => null,
};

export default EventManagementTable;
