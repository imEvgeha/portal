import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {get, isEmpty} from 'lodash';
import {GRID_EVENTS} from '../../ui/elements/nexus-grid/constants';
import {URL} from '../../util/Common';
import EventDrawer from './components/event-drawer/EventDrawer';
import EventManagementTable from './components/event-management-table/EventManagementTable';
import {TITLE} from './eventManagementConstants';
import './EventManagement.scss';
import {getEventById} from './eventManagementService';

const EventManagement = props => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [gridApi, setGridApi] = useState(null);

    const closeEventDrawer = () => {
        setSelectedEvent(null);
        setSearchParams('selectedEventId', null);
        gridApi && gridApi.deselectAll();
    };

    const setSearchParams = (key, value) => {
        const existingParams = new URLSearchParams(props.location.search.substring(1));
        if (!isEmpty(value)) {
            existingParams.set(key, JSON.stringify(value));
        } else {
            existingParams.delete(key);
        }

        const newParams = `?${existingParams.toString()}`;

        props.history.push({
            search: newParams,
        });
    };

    const onSortChanged = ({api}) => {
        const sortModel = api.getSortModel();
        setSearchParams('sort', sortModel);
    };

    const onSelectionChanged = async selectedRow => {
        if (URL.isLocalOrDevOrQA()) {
            // Call api to get event by ID
            if (selectedRow) {
                await getEvent(selectedRow.id);
            }
        } else {
            setSelectedEvent(selectedRow);
        }
    };

    const getEvent = id => {
        return getEventById(id).then(evt => {
            setSelectedEvent({...get(evt, 'event', null), id});
            setSearchParams('selectedEventId', id);
        });
    };

    useEffect(() => {
        const params = new URLSearchParams(props.location.search.substring(1));
        const selectedEventId = JSON.parse(params.get('selectedEventId'));
        if (selectedEventId) {
            getEvent(selectedEventId);
        }
    }, []);

    const onGridEvent = ({type, api}) => {
        const {READY, SELECTION_CHANGED, FILTER_CHANGED} = GRID_EVENTS;
        switch (type) {
            case READY: {
                api.sizeColumnsToFit();
                setGridApi(api);

                const params = new URLSearchParams(props.location.search.substring(1));
                const filterModel = JSON.parse(params.get('filter'));
                const sortModel = JSON.parse(params.get('sort'));

                if (filterModel) {
                    api.setFilterModel(filterModel);
                }
                if (sortModel) {
                    api.setSortModel(sortModel);
                }
                break;
            }

            case SELECTION_CHANGED: {
                onSelectionChanged(get(api.getSelectedRows(), '[0]', null));
                break;
            }

            case FILTER_CHANGED: {
                const filterModel = api.getFilterModel();
                setSearchParams('filter', filterModel);
                break;
            }

            default:
                break;
        }
    };

    return (
        <div className="nexus-c-event-management">
            <div className="nexus-c-event-management__title">{TITLE}</div>
            <div className="nexus-c-event-management__table">
                <EventManagementTable onGridEvent={onGridEvent} onSortChanged={onSortChanged} />
            </div>
            {selectedEvent && <EventDrawer event={selectedEvent} onDrawerClose={closeEventDrawer} />}
        </div>
    );
};

export default EventManagement;

EventManagement.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
};

EventManagement.defaultProps = {
    history: {},
    location: {},
};
