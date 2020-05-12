import React from 'react';
import PropTypes from 'prop-types';
import NexusDrawer from '../../../../ui/elements/nexus-drawer/NexusDrawer';

const EventDrawer = ({eventId, onDrawerClose}) => {
    return (
        <div className='nexus-c-event-drawer'>
            <NexusDrawer
                onClose={onDrawerClose}
                isOpen={!!eventId}
                title='Event Details'
            >
                <div>content</div>
            </NexusDrawer>
        </div>
    );
};

EventDrawer.propTypes = {
    eventId: PropTypes.string,
    onDrawerClose: PropTypes.func,
};

EventDrawer.defaultProps = {
    eventId: '',
    onDrawerClose: () => null,
};

export default EventDrawer;