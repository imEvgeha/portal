import React from 'react';
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

const EventManagementTable = () => (
    <EventManagementGrid columnDefs={columnDefs} />
);

export default EventManagementTable;
