import React, {useState} from 'react';
import PropTypes from 'prop-types';
import HipchatChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import HipchatChevronUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';
import './EventDrawer.scss';
import NexusDrawer from '../../../../ui/elements/nexus-drawer/NexusDrawer';
import NexusJsonView from '../../../../ui/elements/nexus-json-view/NexusJsonView';
import mockData from '../../eventManagementMockData.json';
import Button from '@atlaskit/button';
import EventSectionCollapsible from '../event-section-collapsible/EventSectionCollapsible';
import {
    DRAWER_TITLE,
    DOWNLOAD,
    EVENT_MESSAGE,
} from '../../eventManagementConstants';

const EventDrawer = ({event, onDrawerClose}) => {
    const [isOpened, setIsOpened] = useState(false);
    const toggleJSON = () => {
        setIsOpened(!isOpened);
    };
    return (
        <div className='nexus-c-event-drawer'>
            <NexusDrawer
                onClose={onDrawerClose}
                isOpen={!!(event && event.eventId)}
                title={DRAWER_TITLE}
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
                </div>
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
