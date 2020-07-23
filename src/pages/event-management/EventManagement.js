import React, {useState, useEffect} from 'react';
import {get} from 'lodash';
import EventDrawer from './components/event-drawer/EventDrawer';
import {TITLE} from './eventManagementConstants';
import EventManagementTable from './components/event-management-table/EventManagementTable';
import {GRID_EVENTS} from '../../ui/elements/nexus-grid/constants';
import './EventManagement.scss';
import {getEventById} from './eventManagementService';

const EventManagement = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [gridApi, setGridApi] = useState(null);

    const closeEventDrawer = () => {
        setSelectedEvent(null);
        gridApi && gridApi.deselectAll();
    };

    const onGridEvent = ({type, api}) => {
        const {READY, SELECTION_CHANGED} = GRID_EVENTS;
        switch(type) {
            case READY:
                api.sizeColumnsToFit();
                setGridApi(api);
                break;
            case SELECTION_CHANGED:
                const selectedRow = get(api.getSelectedRows(), '[0]', null);
                // Call api to get event by ID
                if (selectedRow) {
                    getEventById(selectedRow.id).then(evt => {
                        setSelectedEvent(get(evt, 'event', null));
                    });
                }
                break;
        }
    };

    return (
        <div className='nexus-c-event-management'>
            <div className='nexus-c-event-management__title'>
                {TITLE}
            </div>
            <div className="nexus-c-event-management__table">
                <EventManagementTable onGridEvent={onGridEvent} />
            </div>
            {selectedEvent && (
                <EventDrawer
                    event={selectedEvent}
                    onDrawerClose={closeEventDrawer}
                />
            )}
        </div>
    );
};

export default EventManagement;
