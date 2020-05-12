import React, {useState} from 'react';
import EventDrawer from './components/EventDrawer/EventDrawer';
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
        <div className='event-management'>
            <div className='event-management__title'>
                Event Management
            </div>
            <EventDrawer
                eventId={selectedEvent}
                onDrawerClose={closeEventDrawer}
            />
        </div>
    );
};

export default EventManagement;