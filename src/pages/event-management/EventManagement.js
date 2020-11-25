import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {get, isEmpty} from 'lodash';
import {GRID_EVENTS} from '../../ui/elements/nexus-grid/constants';
import EventDrawer from './components/event-drawer/EventDrawer';
import EventManagementTable from './components/event-management-table/EventManagementTable';
import {INITIAL_SORT, TITLE} from './eventManagementConstants';
import './EventManagement.scss';

const EventManagement = props => {
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [gridApi, setGridApi] = useState(null);

    const closeEventDrawer = () => {
        setSelectedEventId(null);
        setSearchParams('selectedEventId', null);
        gridApi && gridApi.deselectAll();
    };

    const setSearchParams = (key, value) => {
        const existingParams = new URLSearchParams(props.location.search.substring(1));
        if (!isEmpty(value) || key === 'sort') {
            existingParams.set(key, JSON.stringify(value));
        } else {
            existingParams.delete(key);
        }

        const newParams = `?${existingParams.toString()}`;

        props.history.push({
            search: newParams,
        });
    };

    const clearFilters = () => {
        if (gridApi) {
            gridApi.setFilterModel(null);
            gridApi.destroyFilter('createdTimeStamp');
            gridApi.destroyFilter('postedTimeStamp');
            gridApi.setFilterModel({
                createdTimeStamp: {},
                postedTimeStamp: {},
            });
            gridApi.onFilterChanged();
            setSearchParams('filter', null);
        }
    };

    const onSortChanged = ({api}) => {
        const sortModel = api.getSortModel();
        setSearchParams('sort', sortModel);
    };

    const onSelectionChanged = selectedRow => {
        if (selectedRow) {
            const {id} = selectedRow;
            setSelectedEventId(id);
            setSearchParams('selectedEventId', id);
        }
    };

    const isFilterModelEmpty = filterModel => {
        if (!filterModel) {
            return true;
        }
        return Object.keys(filterModel).every(filter => isEmpty(filterModel[filter].filter));
    };

    useEffect(() => {
        const params = new URLSearchParams(props.location.search.substring(1));
        const selectedEventId = JSON.parse(params.get('selectedEventId'));
        if (selectedEventId) {
            setSelectedEventId(selectedEventId);
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

                const sortModelParam = params.get('sort');

                // only set the filter model if there is an active filter in the filter model
                if (!isFilterModelEmpty(filterModel)) {
                    api.setFilterModel(filterModel);
                }

                // check is there is a sort param in the URL
                if (sortModelParam) {
                    const sortModel = JSON.parse(sortModelParam);
                    api.setSortModel(sortModel);
                } else {
                    // otherwise set the initial sort
                    const sortModel = api.getSortModel() || [];
                    api.setSortModel([...sortModel, INITIAL_SORT]);
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
                <EventManagementTable
                    clearFilters={clearFilters}
                    onGridEvent={onGridEvent}
                    onSortChanged={onSortChanged}
                />
            </div>
            {selectedEventId && <EventDrawer id={selectedEventId} onDrawerClose={closeEventDrawer} />}
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
