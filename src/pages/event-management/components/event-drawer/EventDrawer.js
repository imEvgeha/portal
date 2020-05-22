import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import NexusDrawer from '../../../../ui/elements/nexus-drawer/NexusDrawer';
import EventDrawerHeader from './components/EventDrawerHeader';
import EventSectionCollapsible from '../event-section-collapsible/EventSectionCollapsible';
import EventHeader from '../event-header/EventHeader';
import NexusJsonView from '../../../../ui/elements/nexus-json-view/NexusJsonView';
import {DRAWER_TITLE, EVENT_MESSAGE, DOWNLOAD, EVENT_HEADER, EVENT_ATTACHMENTS} from '../../eventManagementConstants';
import './EventDrawer.scss';

const EventDrawer = ({event, onDrawerClose}) => (
    <div className='nexus-c-event-drawer'>
        <NexusDrawer
            onClose={onDrawerClose}
            isOpen={!!(event && event.eventId)}
            title={DRAWER_TITLE}
            width="wide"
        >
            {event && (
                <EventDrawerHeader
                    event={event}
                />
            )}
            <div className="nexus-c-event-drawer__content">
                <EventSectionCollapsible
                    title={EVENT_HEADER}
                >
                    <EventHeader event={event} />
                </EventSectionCollapsible>
                <EventSectionCollapsible
                    title={EVENT_MESSAGE}
                    header={
                        <Button>{DOWNLOAD}</Button>
                    }
                >
                    <NexusJsonView
                        src={event}
                        name="vuMessage"
                    />
                </EventSectionCollapsible>
                <EventSectionCollapsible
                    title={`${EVENT_ATTACHMENTS}(${event && event.attachments ? Object.keys(event.attachments).length : 0})`}
                    isDefaultOpened
                >
                    {event && event.attachments && Object.keys(event.attachments).map((key) => {
                          return (
                              <EventSectionCollapsible
                                  title={key}
                                  header={(
                                      <>
                                          <span>MIME type: {event.attachments[key].mimeType}</span>
                                          <span>base64 encoded: {event.attachments[key].base64Encoded.toString()}</span>
                                          <Button>{DOWNLOAD}</Button>
                                      </>
                                  )}
                                  isDefaultOpened
                              >
                                  <NexusJsonView
                                      src={event.attachments[key]}
                                      name={key}
                                  />
                              </EventSectionCollapsible>
                          );
                        })
                    }
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
