import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import './EventDrawer.scss';
import NexusDrawer from '../../../../ui/elements/nexus-drawer/NexusDrawer';
import {DRAWER_TITLE, EVENT_MESSAGE, DOWNLOAD, EVENT_HEADER} from '../../eventManagementConstants';
import EventSectionCollapsible from '../event-section-collapsible/EventSectionCollapsible';
import EventHeader from '../event-header/EventHeader';
import NexusJsonView from '../../../../ui/elements/nexus-json-view/NexusJsonView';
import mockData from '../../eventManagementMockData.json';

const EventDrawer = ({event, onDrawerClose}) => (
    <div className='nexus-c-event-drawer'>
        <NexusDrawer
            onClose={onDrawerClose}
            isOpen={!!(event && event.eventId)}
            title={DRAWER_TITLE}
            width="wide"
        >
            <div className="nexus-c-event-drawer__content">
                <div>{event && event.eventId}</div>
                <EventSectionCollapsible
                    title={EVENT_MESSAGE}
                    header={
                        <Button>{DOWNLOAD}</Button>
                    }
                >
                    <NexusJsonView
                        src={mockData}
                        name="vuMessage"
                    />
                </EventSectionCollapsible>
                <EventSectionCollapsible
                    title={EVENT_HEADER}
                    isInitiallyOpen
                >
                    <EventHeader
                        event={event}
                    />
                </EventSectionCollapsible>
            </div>
        </NexusDrawer>
    </div>
);

EventDrawer.propTypes = {
    event: PropTypes.object,
    onDrawerClose: PropTypes.func,
};

EventDrawer.defaultProps = {
    event: null,
    onDrawerClose: () => null,
};

export default EventDrawer;
