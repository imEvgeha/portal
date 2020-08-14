import React, {useState} from 'react';
import {get} from 'lodash';
import {GRID_EVENTS} from '../../ui/elements/nexus-grid/constants';
import EventDrawer from './components/event-drawer/EventDrawer';
import EventManagementTable from './components/event-management-table/EventManagementTable';
import {TITLE} from './eventManagementConstants';
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
        let selectedRow = null;
        switch (type) {
            case READY:
                api.sizeColumnsToFit();
                setGridApi(api);
                break;
            case SELECTION_CHANGED:
                selectedRow = get(api.getSelectedRows(), '[0]', null);
                // Call api to get event by ID
                if (selectedRow) {
                    getEventById(selectedRow.id).then(evt => {
                        setSelectedEvent({...get(evt, 'event', null), id:selectedRow.id});
                    });
                }
                break;
            default:
                break;
        }
    };

    return (
        <div className="nexus-c-event-management">
            <div className="nexus-c-event-management__title">
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
