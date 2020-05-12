import React, {useState} from 'react';
import EventDrawer from './components/EventDrawer/EventDrawer';
import {TITLE} from './eventManagementConstants';
import EventManagementTable from './components/event-management-table/EventManagementTable';
import './EventManagement.scss';

const EventManagement = () => {
    const [selectedEvent, setSelectedEvent] = useState('');
    const openEventDrawer = eventId => {
        setSelectedEvent(eventId);
    };
    const closeEventDrawer = () => {
        setSelectedEvent('');
    };

    return (
        <div className='nexus-c-event-management'>
            <div className='nexus-c-event-management__title'>
                {TITLE}
            </div>
            <div className="nexus-c-event-management__table">
                <EventManagementTable/>
            </div>
            <EventDrawer
                eventId={selectedEvent}
                onDrawerClose={closeEventDrawer}
            />
        </div>
    );
};

export default EventManagement;