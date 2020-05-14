import React from 'react';
import './EventManagement.scss';
import {TITLE} from './eventManagementConstants';
import EventManagementTable from './components/event-management-table/EventManagementTable';

const EventManagement = () => (
    <div className='nexus-c-event-management'>
        <div className='nexus-c-event-management__title'>
            {TITLE}
        </div>
        <div className="nexus-c-event-management__table">
            <EventManagementTable />
        </div>
    </div>
);

export default EventManagement;
