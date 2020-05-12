import React from 'react';
import PropTypes from 'prop-types';
import NexusDrawer from '../../../../ui/elements/nexus-drawer/NexusDrawer';

const EventDrawer = ({event, onDrawerClose}) => {
    return (
        <div className='nexus-c-event-drawer'>
            <NexusDrawer
                onClose={onDrawerClose}
                isOpen={!!(event && event.eventId)}
                title='Event Details'
            >
                <div>{event && event.eventId}</div>
            </NexusDrawer>
        </div>
    );
};

EventDrawer.propTypes = {
    event: PropTypes.object,
    onDrawerClose: PropTypes.func,
};

EventDrawer.defaultProps = {
    event: null,
    onDrawerClose: () => null,
};

export default EventDrawer;